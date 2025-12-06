import { IpcMain, Notification } from 'electron'
import { checkNow } from '../../notification/notificationScheduler'
import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { eq } from 'drizzle-orm'

/**
 * 알림 관련 IPC 핸들러 설정
 */
export function setupNotificationHandlers(ipcMain: IpcMain): void {
  // 1) 테스트 알림 발송
  ipcMain.handle('notification:test', async (_event, message?: string) => {
    try {
      const notification = new Notification({
        title: 'AI TodoList 테스트',
        body: message || '알림 기능이 정상 작동합니다.',
      })
      notification.show()

      console.log('[Notification] Test notification sent')
      return { success: true }
    } catch (error) {
      console.error('[Notification] Error sending test notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 2) 즉시 알림 체크 실행 (디버깅용)
  ipcMain.handle('notification:checkNow', async () => {
    try {
      await checkNow()
      console.log('[Notification] Manual check executed')
      return { success: true }
    } catch (error) {
      console.error('[Notification] Error during manual check:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 3) Todo의 notified 플래그 리셋 (재알림 설정)
  ipcMain.handle('notification:resetNotified', async (_event, todoId: number) => {
    try {
      await db.update(todos).set({ notified: 0 }).where(eq(todos.id, todoId))

      console.log(`[Notification] Reset notified flag for todo #${todoId}`)
      return { success: true }
    } catch (error) {
      console.error(
        `[Notification] Error resetting notified flag for todo #${todoId}:`,
        error
      )
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}
