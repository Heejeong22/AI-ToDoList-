import { defineConfig } from 'drizzle-kit'
import os from 'os'
import path from 'path'

// connection.ts와 동일한 규칙으로 홈 디렉토리 기반 DB 경로 생성
const homeDir = os.homedir()
const dbPath = path.join(homeDir, '.ai-todo-app', 'database', 'todo.db')

export default defineConfig({
  schema: './src/main/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    // Drizzle CLI가 직접 SQLite 파일을 열 때 사용할 경로
    url: dbPath,
  },
})
