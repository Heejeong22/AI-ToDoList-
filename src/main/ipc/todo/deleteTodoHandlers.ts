import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { eq } from 'drizzle-orm'

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id))
}




