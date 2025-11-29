import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// 단일 todos 테이블 스키마 (요구사항 기준 12개 컬럼)
export const todos = sqliteTable('todos', {
  // 1) 기본 정보
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),

  // 2) AI 자동 분류 정보
  category: text('category'),
  priority: integer('priority'),
  tags: text('tags'),

  // 3) 시간 관련 정보
  alertTime: integer('alert_time'),
  dueDate: integer('due_date'),

  // 4) 상태 정보
  completed: integer('completed').default(0),
  pinned: integer('pinned').default(0),

  // 5) 메타데이터
  createdAt: integer('created_at').default(sql`(strftime('%s','now'))`),
  updatedAt: integer('updated_at'),
  deletedAt: integer('deleted_at'),
})
