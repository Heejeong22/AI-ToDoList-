import React from 'react'
import TodoItem from './TodoItem'
import '../styles/TodoList.css'

interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category?: string
  tags: string[]
  dueDate?: Date
  createdAt: Date
  aiSuggestions?: any
  estimatedTime?: number
}

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: number, updates: Partial<Todo>) => void
  onDelete: (id: number) => void
  onToggleComplete: (id: number) => void
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onUpdate,
  onDelete,
  onToggleComplete
}) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>할 일이 없습니다</h3>
        <p>새로운 할 일을 추가해보세요!</p>
      </div>
    )
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const pendingTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="todo-list">
      {/* 진행 중인 할 일 */}
      {pendingTodos.length > 0 && (
        <div className="todo-section">
          <h3 className="section-title">
            진행 중 ({pendingTodos.length})
          </h3>
          <div className="todos-grid">
            {pendingTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 완료된 할 일 */}
      {completedTodos.length > 0 && (
        <div className="todo-section completed-section">
          <h3 className="section-title">
            완료됨 ({completedTodos.length})
          </h3>
          <div className="todos-grid">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList
