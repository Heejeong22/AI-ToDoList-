import { IpcMain } from 'electron'
import { db } from '../db/drizzle.js'
import { todos, categories, tags } from '../db/schema.js'
import { eq, and, or, like, desc } from 'drizzle-orm'

export function setupTodoHandlers(ipcMain: IpcMain): void {
  // 모든 Todo 가져오기
  ipcMain.handle('todo:getAll', async () => {
    try {
      const result = await db.select().from(todos).orderBy(desc(todos.createdAt))
      return { success: true, data: result }
    } catch (error) {
      console.error('Error fetching todos:', error)
      return { success: false, error: error.message }
    }
  })

  // Todo 생성
  ipcMain.handle('todo:create', async (_, todoData) => {
    try {
      const newTodo = {
        ...todoData,
        tags: JSON.stringify(todoData.tags || []),
        aiSuggestions: JSON.stringify(todoData.aiSuggestions || {}),
      }

      const result = await db.insert(todos).values(newTodo).returning()
      return { success: true, data: result[0] }
    } catch (error) {
      console.error('Error creating todo:', error)
      return { success: false, error: error.message }
    }
  })

  // Todo 업데이트
  ipcMain.handle('todo:update', async (_, { id, updates }) => {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      }

      if (updates.tags) {
        updateData.tags = JSON.stringify(updates.tags)
      }

      if (updates.aiSuggestions) {
        updateData.aiSuggestions = JSON.stringify(updates.aiSuggestions)
      }

      const result = await db
        .update(todos)
        .set(updateData)
        .where(eq(todos.id, id))
        .returning()

      return { success: true, data: result[0] }
    } catch (error) {
      console.error('Error updating todo:', error)
      return { success: false, error: error.message }
    }
  })

  // Todo 삭제
  ipcMain.handle('todo:delete', async (_, id) => {
    try {
      await db.delete(todos).where(eq(todos.id, id))
      return { success: true }
    } catch (error) {
      console.error('Error deleting todo:', error)
      return { success: false, error: error.message }
    }
  })

  // Todo 완료 토글
  ipcMain.handle('todo:toggleComplete', async (_, id) => {
    try {
      // 현재 상태 확인
      const currentTodo = await db
        .select({ completed: todos.completed })
        .from(todos)
        .where(eq(todos.id, id))
        .limit(1)

      if (currentTodo.length === 0) {
        return { success: false, error: 'Todo not found' }
      }

      const result = await db
        .update(todos)
        .set({
          completed: !currentTodo[0].completed,
          updatedAt: new Date()
        })
        .where(eq(todos.id, id))
        .returning()

      return { success: true, data: result[0] }
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      return { success: false, error: error.message }
    }
  })

  // Todo 검색
  ipcMain.handle('todo:search', async (_, query) => {
    try {
      const searchTerm = `%${query}%`
      const result = await db
        .select()
        .from(todos)
        .where(
          or(
            like(todos.title, searchTerm),
            like(todos.description, searchTerm),
            like(todos.category, searchTerm)
          )
        )
        .orderBy(desc(todos.createdAt))

      return { success: true, data: result }
    } catch (error) {
      console.error('Error searching todos:', error)
      return { success: false, error: error.message }
    }
  })

  // 카테고리별 Todo 필터링
  ipcMain.handle('todo:getByCategory', async (_, category) => {
    try {
      const result = await db
        .select()
        .from(todos)
        .where(eq(todos.category, category))
        .orderBy(desc(todos.createdAt))

      return { success: true, data: result }
    } catch (error) {
      console.error('Error filtering todos by category:', error)
      return { success: false, error: error.message }
    }
  })

  // 우선순위별 Todo 가져오기
  ipcMain.handle('todo:getByPriority', async (_, priority) => {
    try {
      const result = await db
        .select()
        .from(todos)
        .where(eq(todos.priority, priority))
        .orderBy(desc(todos.createdAt))

      return { success: true, data: result }
    } catch (error) {
      console.error('Error filtering todos by priority:', error)
      return { success: false, error: error.message }
    }
  })
}
