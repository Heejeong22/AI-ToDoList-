import { IpcMain } from 'electron'
import { createTodo } from './createTodoHandlers'
import { updateTodo, toggleCompleteTodo } from './updateTodoHandlers'
import { deleteTodo } from './deleteTodoHandlers'
import {
  getAllTodos,
  searchTodos,
  getTodosByCategory,
  getTodosByPriority,
} from './getTodosHandlers'

// todo 관련 IPC 등록
export function setupTodoHandlers(ipcMain: IpcMain): void {
  // 모든 Todo 가져오기
  ipcMain.handle('todo:getAll', async () => {
    try {
      const result = await getAllTodos()
      return { success: true, data: result }
    } catch (error) {
      console.error('Error fetching todos:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 생성
  ipcMain.handle('todo:create', async (_event, todoData) => {
    try {
      const result = await createTodo(todoData)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error creating todo:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 업데이트
  ipcMain.handle('todo:update', async (_event, { id, updates }) => {
    try {
      const result = await updateTodo(id, updates)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating todo:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 삭제
  ipcMain.handle('todo:delete', async (_event, id: number) => {
    try {
      await deleteTodo(id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting todo:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 완료 토글
  ipcMain.handle('todo:toggleComplete', async (_event, id: number) => {
    try {
      const result = await toggleCompleteTodo(id)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 검색
  ipcMain.handle('todo:search', async (_event, query: string) => {
    try {
      const result = await searchTodos(query)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error searching todos:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 카테고리별 Todo 필터링
  ipcMain.handle('todo:getByCategory', async (_event, category: string) => {
    try {
      const result = await getTodosByCategory(category)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error filtering todos by category:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 우선순위별 Todo 가져오기
  ipcMain.handle('todo:getByPriority', async (_event, priority: number) => {
    try {
      const result = await getTodosByPriority(priority)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error filtering todos by priority:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
}


