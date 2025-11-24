import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'database.sqlite')

// SQLite 데이터베이스 연결
const sqlite = new Database(dbPath)

// Drizzle ORM 인스턴스 생성
export const db = drizzle(sqlite, { schema })

// 데이터베이스 연결 종료 함수
export function closeDatabase(): void {
  sqlite.close()
}

// 마이그레이션 및 초기화 함수
export async function initializeDatabase(): Promise<void> {
  try {
    // WAL 모드 활성화 (성능 향상)
    sqlite.pragma('journal_mode = WAL')

    // 외래 키 제약 조건 활성화
    sqlite.pragma('foreign_keys = ON')

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

// 개발 모드에서만 데이터베이스 파일 경로 로깅
if (process.env.NODE_ENV === 'development') {
  console.log('Database path:', dbPath)
}
//db수정작업
export default db
