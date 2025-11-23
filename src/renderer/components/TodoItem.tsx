import React, { useState } from 'react'
import './TodoItem.css'

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

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: number, updates: Partial<Todo>) => void
  onDelete: (id: number) => void
  onToggleComplete: (id: number) => void
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  onToggleComplete
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <div className="todo-checkbox">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
          />
        </div>

        <div className="todo-content" onClick={() => !isEditing && setIsEditing(true)}>
          {isEditing ? (
            <div className="todo-edit">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="edit-title"
                placeholder="할 일 제목"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="edit-description"
                placeholder="상세 설명 (선택사항)"
                rows={2}
              />
              <div className="edit-actions">
                <button onClick={handleSave} className="btn-save">저장</button>
                <button onClick={handleCancel} className="btn-cancel">취소</button>
              </div>
            </div>
          ) : (
            <div className="todo-display">
              <h3 className={`todo-title ${todo.completed ? 'strikethrough' : ''}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
            </div>
          )}
        </div>

        <div className="todo-actions">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-edit"
                title="수정"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="btn-delete"
                title="삭제"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      <div className="todo-footer">
        <div className="todo-meta">
          <span
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(todo.priority) }}
          >
            {todo.priority === 'high' ? '높음' :
             todo.priority === 'medium' ? '중간' : '낮음'}
          </span>

          {todo.category && (
            <span className="category-badge">{todo.category}</span>
          )}

          {todo.estimatedTime && (
            <span className="time-badge">⏱️ {todo.estimatedTime}분</span>
          )}
        </div>

        <div className="todo-tags">
          {todo.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="todo-date">
          {formatDate(todo.createdAt)}
        </div>
      </div>
    </div>
  )
}

export default TodoItem
