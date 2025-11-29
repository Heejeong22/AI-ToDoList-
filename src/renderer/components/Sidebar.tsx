import React from 'react'
import '../styles/Sidebar.css'

interface Todo {
  id: number
  category?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  todos: Todo[]
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  todos
}) => {
  // 카테고리별 할 일 수 계산
  const categoryStats = todos.reduce((acc, todo) => {
    const category = todo.category || '기타'
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0 }
    }
    acc[category].total++
    if (todo.completed) {
      acc[category].completed++
    }
    return acc
  }, {} as Record<string, { total: number, completed: number }>)

  // 우선순위별 통계
  const priorityStats = todos.reduce((acc, todo) => {
    if (!acc[todo.priority]) {
      acc[todo.priority] = { total: 0, completed: 0 }
    }
    acc[todo.priority].total++
    if (todo.completed) {
      acc[todo.priority].completed++
    }
    return acc
  }, {} as Record<string, { total: number, completed: number }>)

  const categories = [
    { id: 'all', name: '전체', icon: '📋', count: todos.length },
    ...Object.entries(categoryStats).map(([category, stats]) => ({
      id: category,
      name: category,
      icon: '📁',
      count: stats.total,
      completed: stats.completed
    }))
  ]

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'high': return '높음'
      case 'medium': return '중간'
      case 'low': return '낮음'
      default: return priority
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="section-title">카테고리</h3>
        <nav className="category-list">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">
                {category.count}
                {category.completed !== undefined && (
                  <span className="completed-count">/{category.completed}</span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">우선순위</h3>
        <div className="priority-list">
          {Object.entries(priorityStats).map(([priority, stats]) => (
            <div key={priority} className="priority-item">
              <span className="priority-icon">{getPriorityIcon(priority)}</span>
              <span className="priority-name">{getPriorityName(priority)}</span>
              <span className="priority-count">
                {stats.total}
                <span className="completed-count">/{stats.completed}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">통계</h3>
        <div className="stats-list">
          <div className="stat-item">
            <span className="stat-label">총 할 일</span>
            <span className="stat-value">{todos.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">완료됨</span>
            <span className="stat-value">{todos.filter(t => t.completed).length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">진행 중</span>
            <span className="stat-value">{todos.filter(t => !t.completed).length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">완료율</span>
            <span className="stat-value">
              {todos.length > 0
                ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
