import React, { useState } from 'react'
import './TodoForm.css'

interface Todo {
  id?: number
  title: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  tags?: string[]
  dueDate?: Date
  aiSuggestions?: any
  estimatedTime?: number
}

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void
  initialData?: Partial<Todo>
  onCancel?: () => void
}

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  onCancel
}) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium')
  const [category, setCategory] = useState(initialData?.category || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '')
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimatedTime || 30)
  const [tagInput, setTagInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    const todoData: Omit<Todo, 'id' | 'createdAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      category: category.trim() || undefined,
      tags,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedTime: estimatedTime || undefined,
    }

    onSubmit(todoData)

    // 폼 초기화
    if (!initialData) {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setCategory('')
      setTags([])
      setDueDate('')
      setEstimatedTime(30)
      setTagInput('')
      setIsExpanded(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleAIAnalysis = async () => {
    if (!title.trim()) return

    try {
      const response = await window.api.ai.analyzeComprehensive(title, description)
      if (response.success) {
        const suggestions = response.data.suggestions
        setPriority(suggestions.priority || priority)
        setCategory(suggestions.category || category)
        setEstimatedTime(suggestions.estimatedTime || estimatedTime)
      }
    } catch (error) {
      console.error('AI 분석 실패:', error)
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-main">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="새로운 할 일을 입력하세요..."
          className="title-input"
          required
        />

        <div className="form-actions">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-expand"
          >
            {isExpanded ? '간단히' : '자세히'}
          </button>

          {title.trim() && (
            <button
              type="button"
              onClick={handleAIAnalysis}
              className="btn-ai"
              title="AI로 분석하기"
            >
              🤖 AI 분석
            </button>
          )}

          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel">
              취소
            </button>
          )}

          <button type="submit" className="btn-submit" disabled={!title.trim()}>
            추가
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="form-expanded">
          <div className="form-row">
            <label>우선순위:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
              <option value="low">낮음</option>
              <option value="medium">중간</option>
              <option value="high">높음</option>
            </select>
          </div>

          <div className="form-row">
            <label>카테고리:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="예: 업무, 개인, 학습..."
            />
          </div>

          <div className="form-row">
            <label>예상 시간 (분):</label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
              min="5"
              max="480"
              step="5"
            />
          </div>

          <div className="form-row">
            <label>마감일:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>태그:</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="태그 입력 후 Enter"
              />
              <button type="button" onClick={handleAddTag}>추가</button>
            </div>
            <div className="tags-list">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label>상세 설명:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="할 일에 대한 자세한 설명을 입력하세요..."
              rows={3}
            />
          </div>
        </div>
      )}
    </form>
  )
}

export default TodoForm
