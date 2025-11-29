import { db, dbPath, sqlite } from './connection.js'
import * as schema from './schema.js'

// 데이터베이스 연결 종료 함수
export function closeDatabase(): void {
  sqlite.close()
}

// 마이그레이션 및 초기화 함수
export async function initializeDatabase(): Promise<void> {
  try {
    // DB 초기화는 connection.ts에서 이미 처리됨
    console.log('Database initialized successfully')
    console.log('Database path:', dbPath)
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}
// db 인스턴스를 기본/이름 export 모두 제공
export { db }
export default db
