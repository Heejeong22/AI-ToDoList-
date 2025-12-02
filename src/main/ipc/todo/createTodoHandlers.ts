import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { analyzeCategory } from '../ai/analyzeCategoryHandlers'

// Date → SQLite에서 사용하는 UNIX 초(number)로 변환
const toUnixSeconds = (value: any | undefined | null): number | null => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return Math.floor(d.getTime() / 1000)
}

export interface CreateTodoInput {
  title: string
  alertTime?: Date | string | number | null
  dueDate?: Date | string | number | null
  priority?: number | null
  tags?: string[]
}

export async function createTodo(todoData: CreateTodoInput) {
  const { title, alertTime, dueDate, priority, tags } = todoData

  // 1) AI로 카테고리 자동 분류
  const categoryResult = analyzeCategory(title)
  const category = categoryResult.category

  const newTodo = {
    title,
    category,
    alertTime: toUnixSeconds(alertTime),
    dueDate: toUnixSeconds(dueDate),
    priority: priority ?? null,
    tags: tags ? JSON.stringify(tags) : null,
    completed: 0,
    pinned: 0,
  }

  const result = await db.insert(todos).values(newTodo).returning()
  return result[0]
}


