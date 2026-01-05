import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { analyzeCategory } from '../ai/analyzeCategoryHandlers'

// 공통: 값 → 로컬 Date 객체로 변환
const parseToLocalDate = (value: any | undefined | null): Date | null => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    const str = value.trim()

    // "YYYY-MM-DD" (주의: new Date("YYYY-MM-DD")는 UTC로 해석되어 날짜가 하루 밀릴 수 있음)
    const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
    if (ymdMatch) {
      const [, y, m, day] = ymdMatch
      return new Date(Number(y), Number(m) - 1, Number(day), 0, 0, 0, 0)
    }

    // "YYYY-MM-DDTHH:MM(:SS)[.sss][Z]" 또는 "YYYY-MM-DD HH:MM" 직접 파싱
    const isoMatch =
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?Z?$/.exec(str)
    if (isoMatch) {
      const [, y, m, day, h, min, s] = isoMatch
      return new Date(
        Number(y),
        Number(m) - 1,
        Number(day),
        Number(h),
        Number(min),
        s ? Number(s) : 0,
        0,
      )
    }

    const tmp = new Date(str)
    return Number.isNaN(tmp.getTime()) ? null : tmp
  }

  const tmp = new Date(value)
  return Number.isNaN(tmp.getTime()) ? null : tmp
}

// Date / 문자열 → 로컬 기준 "YYYY-MM-DD HH:MM" 문자열로 변환
const toYmdHm = (value: any | undefined | null): string | null => {
  const d = parseToLocalDate(value)
  if (!d) return null

  const pad = (v: number) => v.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

export interface CreateTodoInput {
  title: string
  // GPT/AI가 이미 판별한 카테고리(예: 'health', 'study' ...)
  // 없으면 메인 프로세스에서 analyzeCategory로 fallback
  category?: string | null
  alertTime?: Date | string | number | null
  dueDate?: Date | string | number | null
  dueTime?: string | null  // 'HH:MM' 형식 - 시간이 명시적으로 설정되었는지 체크용
  priority?: number | null
  tags?: string[]
}

export async function createTodo(todoData: CreateTodoInput) {
  const { title, category: inputCategory, dueDate, dueTime, priority, tags } = todoData

  // 1) 카테고리 결정
  //    - 우선 GPT/프론트에서 넘어온 category 사용
  //    - 없으면 기존 rule-based analyzeCategory(title)로 분류
  let category: string
  if (inputCategory && typeof inputCategory === 'string' && inputCategory.trim().length > 0) {
    category = inputCategory
  } else {
    const categoryResult = analyzeCategory(title)
    category = categoryResult.category
  }

  // 2) 마감 시간(dueDate): 사용자가 입력한 시간 그대로 문자열로 저장
  const dueDateStr = toYmdHm(dueDate)

  // 3) 리마인더(alertTime): 시간이 명시적으로 설정된 경우에만 5분 전으로 생성
  let alertTimeStr: string | null = null

  if (dueDateStr && dueTime) {  // ✅ dueTime이 있을 때만 alertTime 생성
    const base = parseToLocalDate(dueDate)
    if (base && !Number.isNaN(base.getTime())) {
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

