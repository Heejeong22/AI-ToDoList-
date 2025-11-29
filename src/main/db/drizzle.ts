import { db, dbPath, sqlite } from './connection.js'

// 데이터베이스 연결 종료 함수
export function closeDatabase(): void {
  sqlite.close()
}

// 마이그레이션 및 초기화 함수
export async function initializeDatabase(): Promise<void> {
  try {
    // todos 테이블이 없으면 생성 (단일 테이블 스키마)
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT NOT NULL,
        category TEXT,
        priority INTEGER,
        tags TEXT,
        alert_time INTEGER,
        due_date INTEGER,
        completed INTEGER DEFAULT 0,
        pinned INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s','now')),
        updated_at INTEGER,
        deleted_at INTEGER
      );
    `)

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
