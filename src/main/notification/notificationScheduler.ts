import { Notification, BrowserWindow } from 'electron'
import { db } from '../db/drizzle'
import { todos } from '../db/schema'
import { eq, and, lte, isNotNull, isNull } from 'drizzle-orm'

let schedulerInterval: NodeJS.Timeout | null = null
let mainWindow: BrowserWindow | null = null

const emitLog = (message: string) => {
  console.log(message)
  if (mainWindow) {
    mainWindow.webContents.send('notification:log', message)
  }
}

/**
 * 알림 스케줄러 초기화
 * 앱 시작 시 호출하여 30초마다 알림 체크 시작
 */
export function initializeNotificationScheduler(window: BrowserWindow): void {
  mainWindow = window

  // 30초마다 알림 체크
  schedulerInterval = setInterval(checkAndSendNotifications, 30000)

  emitLog('[Notification Scheduler] Started (interval: 30s)')

  // 시작 직후 한 번 실행
  checkAndSendNotifications()
}

/**
 * 알림 스케줄러 종료
 * 앱 종료 시 호출하여 interval 정리
 */
export function stopNotificationScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval)
    schedulerInterval = null
    emitLog('[Notification Scheduler] Stopped')
  }
}

/**
 * 즉시 알림 체크 실행
 * 테스트 및 디버깅 용도
 */
export async function checkNow(): Promise<void> {
  await checkAndSendNotifications()
}

/**
 * 알림 체크 및 발송 핵심 로직
 * - alertTime <= 현재시간인 todo 조회
 * - completed=0, notified=0, deletedAt=null 조건
 * - 최대 10개까지만 처리
 */
async function checkAndSendNotifications(): Promise<void> {
  try {
    // 현재 시각을 "YYYY-MM-DD HH:MM" 형식으로 생성
    const now = new Date()
    const nowStr = formatDateTime(now)

    // DB 쿼리: 알림 발송 대상 조회
    const pendingNotifications = await db
      .select()
      .from(todos)
      .where(
        and(
          isNotNull(todos.alertTime), // alertTime이 설정되어 있고
          lte(todos.alertTime, nowStr), // alertTime <= 현재시간
          eq(todos.completed, 0), // 완료되지 않았으며
          eq(todos.notified, 0), // 아직 알림 발송 안 했고
          isNull(todos.deletedAt) // 삭제되지 않은 todo
        )
      )
      .limit(10) // 한 번에 최대 10개까지만

    if (pendingNotifications.length === 0) {
      emitLog(`[Notification] ${nowStr} 기준 알림 대상 없음`)
      return
    }

    emitLog(`[Notification] ${pendingNotifications.length}개의 알림 발송 중...`)

    // 각 todo에 대해 알림 발송 및 notified 플래그 업데이트
    for (const todo of pendingNotifications) {
      try {
        sendNotification(todo)

        // notified 플래그 업데이트
        await db
          .update(todos)
          .set({ notified: 1 })
          .where(eq(todos.id, todo.id))

        emitLog(`[Notification] Todo #${todo.id} "${todo.title}" 알림 발송`)
      } catch (error) {
        console.error(
          `[Notification] Failed to send notification for todo #${todo.id}:`,
          error
        )
        // 알림 발송 실패 시 notified 플래그를 업데이트하지 않음 (다음 체크 때 재시도)
      }
    }
  } catch (error) {
    console.error('[Notification Scheduler] Error during check:', error)
    emitLog(
      `[Notification Scheduler] 오류: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

/**
 * Electron Notification API로 시스템 알림 발송
 * macOS: 알림 센터, Windows: 토스트 알림
 */
function sendNotification(todo: any): void {
  // 알림 본문 구성
  let body = todo.title
  if (todo.dueDate) {
    body += `\n마감: ${todo.dueDate}`
  }

  // Notification 생성
  const notification = new Notification({
    title: 'AI TodoList 알림',
    body: body,
    silent: false,
    urgency: 'normal',
  })

  // 알림 클릭 시 앱 포커스
  notification.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.show()
      mainWindow.focus()

      // 해당 todo로 스크롤 (렌더러로 이벤트 전송)
      mainWindow.webContents.send('notification:clicked', todo.id)
    }
  })

  // 알림 표시
  notification.show()
}

/**
 * Date 객체를 "YYYY-MM-DD HH:MM" 형식 문자열로 변환
 */
function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
