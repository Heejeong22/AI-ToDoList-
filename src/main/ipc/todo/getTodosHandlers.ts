import { db } from '../../db/drizzle'
import { todos } from '../../db/schema'
import { desc, eq, like, or } from 'drizzle-orm'

export async function getAllTodos() {
  const result = await db.select().from(todos).orderBy(desc(todos.createdAt))
  return result
}

export async function searchTodos(query: string) {
  const searchTerm = `%${query}%`

  const result = await db
    .select()
    .from(todos)
    .where(
      or(
        like(todos.title, searchTerm),
        // description 컬럼은 없으므로 title / category만 검색
        like(todos.category, searchTerm),
        like(todos.tags, searchTerm),
      ),
    )
    .orderBy(desc(todos.createdAt))

  return result
}

export async function getTodosByCategory(category: string) {
  const result = await db
    .select()
    .from(todos)
    .where(eq(todos.category, category))
    .orderBy(desc(todos.createdAt))

  return result
}

export async function getTodosByPriority(priority: number) {
  const result = await db
    .select()
    .from(todos)
    .where(eq(todos.priority, priority))
    .orderBy(desc(todos.createdAt))

  return result
}





