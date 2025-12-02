import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { eq } from 'drizzle-orm'

const toUnixSeconds = (value: any | undefined | null): number | null => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return Math.floor(d.getTime() / 1000)
}

export async function updateTodo(id: number, updates: any) {
  const updateData: any = {
    ...updates,
  }

  if (updates.tags) {
    updateData.tags = JSON.stringify(updates.tags)
  }

  if (updates.alertTime) {
    updateData.alertTime = toUnixSeconds(updates.alertTime)
  }

  if (updates.dueDate) {
    updateData.dueDate = toUnixSeconds(updates.dueDate)
  }

  updateData.updatedAt = Math.floor(Date.now() / 1000)

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
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(todos.id, id))
    .returning()

  return result[0]
}


