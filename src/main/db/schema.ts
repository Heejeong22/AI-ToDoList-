import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// Todos 테이블
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).default('medium'),
  category: text('category'),
  tags: text('tags'), // JSON string으로 저장
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  aiSuggestions: text('ai_suggestions'), // AI 추천 사항 JSON
  estimatedTime: integer('estimated_time'), // 예상 소요 시간 (분)
})

// Categories 테이블
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  color: text('color').default('#6366f1'),
  icon: text('icon'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Tags 테이블
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  color: text('color').default('#10b981'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// AI 분석 결과 저장 테이블
export const aiAnalyses = sqliteTable('ai_analyses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  todoId: integer('todo_id').references(() => todos.id),
  analysisType: text('analysis_type').notNull(), // 'priority', 'category', 'time'
  result: text('result').notNull(), // JSON string
  confidence: real('confidence'), // 0.0 ~ 1.0
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 사용자 설정 테이블
export const userSettings = sqliteTable('user_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 통계 데이터 테이블
export const statistics = sqliteTable('statistics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  completedTodos: integer('completed_todos').default(0),
  totalTodos: integer('total_todos').default(0),
  productivityScore: real('productivity_score'),
  focusTime: integer('focus_time'), // 집중 시간 (분)
})
