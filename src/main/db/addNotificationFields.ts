import { getSqlite } from './connection'

/**
 * 알림 기능을 위한 데이터베이스 마이그레이션
 * - notified 컬럼 추가
 * - alertTime 인덱스 생성
 * - 기존 레코드 처리
 */
export async function addNotificationFields(): Promise<void> {
  try {
    console.log('[Migration] Adding notification fields...')

    const sqlite = getSqlite()

    // 1. notified 컬럼이 이미 존재하는지 확인
    const tableInfo = sqlite.pragma('table_info(todos)') as any[]
    const hasNotified = tableInfo.some((col: any) => col.name === 'notified')

    if (!hasNotified) {
      // notified 컬럼 추가
      sqlite.exec('ALTER TABLE todos ADD COLUMN notified INTEGER DEFAULT 0')
      console.log('[Migration] Added notified column')
    } else {
      console.log('[Migration] notified column already exists')
    }

    // 2. alertTime 인덱스 생성 (이미 존재해도 에러 안 남)
    sqlite.exec('CREATE INDEX IF NOT EXISTS alert_time_idx ON todos(alert_time)')
    console.log('[Migration] Created alert_time_idx index')

    // 3. 기존 레코드 중 alertTime이 과거인 것들은 notified=1로 설정
    sqlite.exec(`
      UPDATE todos
      SET notified = 1
      WHERE alert_time IS NOT NULL
        AND alert_time < strftime('%Y-%m-%d %H:%M', 'now', 'localtime')
        AND notified = 0
    `)
    console.log('[Migration] Updated past alertTime records')

    console.log('[Migration] Notification fields migration completed successfully')
  } catch (error) {
    console.error('[Migration] Error adding notification fields:', error)
    // 에러가 발생해도 앱은 계속 실행 (컬럼이 이미 존재하는 경우 등)
  }
}
