import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { eq } from 'drizzle-orm'

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

export async function updateTodo(id: number, updates: any) {
  const updateData: any = {
    ...updates,
  }

  // SQLite boolean 호환성 처리 (true -> 1, false -> 0)
  if (typeof updates.pinned === 'boolean') {
    updateData.pinned = updates.pinned ? 1 : 0
  }
  if (typeof updates.completed === 'boolean') {
    updateData.completed = updates.completed ? 1 : 0
  }
  if (typeof updates.notified === 'boolean') {
    updateData.notified = updates.notified ? 1 : 0
  }

  if (updates.tags) {
    updateData.tags = JSON.stringify(updates.tags)
  }

  // 마감 시간이 변경되면 문자열로 저장 + alertTime도 같이 5분 전으로 재계산
  if (updates.dueDate) {
    const dueStr = toYmdHm(updates.dueDate)
    updateData.dueDate = dueStr

    if (updates.alertTime === undefined && dueStr) {
      const base = parseToLocalDate(updates.dueDate)
      if (base) {
        base.setMinutes(base.getMinutes() - 5)
        updateData.alertTime = toYmdHm(base)
      }
    }
  }

  // alertTime을 직접 수정하는 경우도 문자열로 변환
  if (updates.alertTime !== undefined) {
    updateData.alertTime = toYmdHm(updates.alertTime)
    // alertTime 변경 시 notified 플래그 리셋 (재알림 가능하도록)
    updateData.notified = 0
  }

  // updatedAt은 "지금"을 문자열(YYYY-MM-DD HH:MM)로 저장
  updateData.updatedAt = toYmdHm(new Date())

  const result = await db
    .update(todos)
    .set(updateData)
    .where(eq(todos.id, id))
    .returning()

  return result[0]
}

export async function toggleCompleteTodo(id: number) {
  const currentTodo = await db
    .select({ completed: todos.completed })
    .from(todos)
    .where(eq(todos.id, id))
    .limit(1)

  if (currentTodo.length === 0) {
    throw new Error('Todo not found')
  }

  // 불리언을 0/1 정수로 변환 (SQLite는 정수만 지원)
  const newCompletedValue = currentTodo[0].completed ? 0 : 1

  const result = await db
    .update(todos)
    .set({
      completed: newCompletedValue,
      updatedAt: toYmdHm(new Date()),
    })
    .where(eq(todos.id, id))
    .returning()

  return result[0]
}
