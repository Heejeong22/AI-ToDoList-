import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { analyzeCategory } from '../ai/analyzeCategoryHandlers'

// Date → "YYYY-MM-DD HH:MM" 문자열로 변환
const toYmdHm = (value: any | undefined | null): string | null => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const pad = (v: number) => v.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

export interface CreateTodoInput {
  title: string
  alertTime?: Date | string | number | null
  dueDate?: Date | string | number | null
  dueTime?: string | null  // 'HH:MM' 형식 - 시간이 명시적으로 설정되었는지 체크용
  priority?: number | null
  tags?: string[]
}

export async function createTodo(todoData: CreateTodoInput) {
  const { title, dueDate, dueTime, priority, tags } = todoData

  // 1) AI로 카테고리 자동 분류
  const categoryResult = analyzeCategory(title)
  const category = categoryResult.category

  // 2) 마감 시간(dueDate): 사용자가 입력한 시간 그대로 문자열로 저장
  const dueDateStr = toYmdHm(dueDate)

  // 3) 리마인더(alertTime): 시간이 명시적으로 설정된 경우에만 5분 전으로 생성
  let alertTimeStr: string | null = null
  if (dueDateStr && dueTime) {  // ✅ dueTime이 있을 때만 alertTime 생성
    const base = new Date(dueDate as any)
    if (!Number.isNaN(base.getTime())) {
      base.setMinutes(base.getMinutes() - 5)
      alertTimeStr = toYmdHm(base)
    }
  }

  // 4) 생성 시간(createdAt): 지금 시각을 문자열로 저장
  const createdAt = toYmdHm(new Date())

  const newTodo = {
    title,
    category,
    alertTime: alertTimeStr,
    dueDate: dueDateStr,
    priority: priority ?? null,
    tags: tags ? JSON.stringify(tags) : null,
    completed: 0,
    pinned: 0,
    createdAt,
  }

  const result = await db.insert(todos).values(newTodo).returning()
  return result[0]
}

