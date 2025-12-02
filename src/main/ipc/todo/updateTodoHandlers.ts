import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { eq } from 'drizzle-orm'

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

export async function updateTodo(id: number, updates: any) {
  const updateData: any = {
    ...updates,
  }

  if (updates.tags) {
    updateData.tags = JSON.stringify(updates.tags)
  }

  // 마감 시간이 변경되면 문자열로 저장 + alertTime도 같이 5분 전으로 재계산
  if (updates.dueDate) {
    const dueStr = toYmdHm(updates.dueDate)
    updateData.dueDate = dueStr

    if (updates.alertTime === undefined && dueStr) {
      const base = new Date(updates.dueDate as any)
      if (!Number.isNaN(base.getTime())) {
        base.setMinutes(base.getMinutes() - 5)
        updateData.alertTime = toYmdHm(base)
      }
    }
  }

  // alertTime을 직접 수정하는 경우도 문자열로 변환
  if (updates.alertTime) {
    updateData.alertTime = toYmdHm(updates.alertTime)
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

  const result = await db
    .update(todos)
    .set({
      completed: !currentTodo[0].completed,
      updatedAt: toYmdHm(new Date()),
    })
    .where(eq(todos.id, id))
    .returning()

  return result[0]
}


