import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import AIAnalysisPanel from './components/AIAnalysisPanel'
import './styles/App.css'

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

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAIPanel, setShowAIPanel] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
    loadTodos()
  }, [])

  // 단축키 이벤트 리스너
  useEffect(() => {
    const handleShortcut = (event: string) => {
      switch (event) {
        case 'new-todo':
          // 새 Todo 추가 모달 열기
          break
        case 'ai-analysis':
          setShowAIPanel(true)
          break
        case 'search':
          // 검색창 포커스
          break
      }
    }

    // 단축키 리스너 등록
    window.api.on('shortcut:new-todo', () => handleShortcut('new-todo'))
    window.api.on('shortcut:ai-analysis', () => handleShortcut('ai-analysis'))
    window.api.on('shortcut:search', () => handleShortcut('search'))

    return () => {
      // 클린업
      window.api.removeListener('shortcut:new-todo', () => {})
      window.api.removeListener('shortcut:ai-analysis', () => {})
      window.api.removeListener('shortcut:search', () => {})
    }
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const response = await window.api.todo.getAll()
      if (response.success) {
        setTodos(response.data)
      }
    } catch (error) {
      console.error('Failed to load todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    try {
      const response = await window.api.todo.create(todoData)
      if (response.success) {
        setTodos(prev => [response.data, ...prev])
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const response = await window.api.todo.update(id, updates)
      if (response.success) {
        setTodos(prev => prev.map(todo =>
          todo.id === id ? { ...todo, ...response.data } : todo
        ))
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await window.api.todo.delete(id)
      if (response.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const handleToggleComplete = async (id: number) => {
    try {
      const response = await window.api.todo.toggleComplete(id)
      if (response.success) {
        setTodos(prev => prev.map(todo =>
          todo.id === id ? response.data : todo
        ))
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>AI TodoList 로딩 중...</h2>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        onSearch={setSearchQuery}
        onToggleAIPanel={() => setShowAIPanel(!showAIPanel)}
      />

      <div className="main-content">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          todos={todos}
        />

        <div className="content-area">
          <div className="content-header">
            <h1>
              {selectedCategory === 'all' ? '모든 할 일' : `${selectedCategory} 할 일`}
              <span className="todo-count">({filteredTodos.length})</span>
            </h1>
            <TodoForm onSubmit={handleAddTodo} />
          </div>

          <TodoList
            todos={filteredTodos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            onToggleComplete={handleToggleComplete}
          />
        </div>

        {showAIPanel && (
          <AIAnalysisPanel
            onClose={() => setShowAIPanel(false)}
            onApplySuggestion={handleAddTodo}
          />
        )}
      </div>
    </div>
  )
}

export default App
