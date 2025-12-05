import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core'
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
  // 모두 사람이 읽을 수 있는 문자열로 저장 (YYYY-MM-DD HH:MM)
  alertTime: text('alert_time'),
  dueDate: text('due_date'),

  // 4) 상태 정보
  completed: integer('completed').default(0),
  pinned: integer('pinned').default(0),
  notified: integer('notified').default(0), // 알림 발송 여부 (0: 미발송, 1: 발송됨)

  // 5) 메타데이터
  // 생성/수정 시간은 사람이 읽기 쉬운 문자열(YYYY-MM-DD HH:MM)로 저장
  createdAt: text('created_at').default(
    sql`(strftime('%Y-%m-%d %H:%M','now','localtime'))`,
  ),
  updatedAt: text('updated_at'),
  deletedAt: integer('deleted_at'),
}, (table) => ({
  // 알림 체크 성능 최적화를 위한 인덱스
  alertTimeIdx: index('alert_time_idx').on(table.alertTime),
}))
