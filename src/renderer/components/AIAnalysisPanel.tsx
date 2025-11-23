import React, { useState } from 'react'
import './AIAnalysisPanel.css'

interface Todo {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  estimatedTime?: number
}

interface AIAnalysisPanelProps {
  onClose: () => void
  onApplySuggestion: (todo: Omit<Todo, 'id' | 'createdAt'>) => void
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  onClose,
  onApplySuggestion
}) => {
  const [inputText, setInputText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setAnalyzing(true)
    try {
      const response = await window.api.ai.analyzeComprehensive(inputText)
      if (response.success) {
        setAnalysisResult(response.data)
        // 기본적으로 첫 번째 제안을 선택
        setSelectedSuggestion(0)
      }
    } catch (error) {
      console.error('AI 분석 실패:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleApplySuggestion = () => {
    if (!analysisResult || selectedSuggestion === null) return

    const suggestions = analysisResult.suggestions
    const todoData: Omit<Todo, 'id' | 'createdAt'> = {
      title: suggestions.title,
      description: `AI 분석 결과: ${suggestions.reasoning}`,
      completed: false,
      priority: suggestions.priority,
      category: suggestions.category,
      estimatedTime: suggestions.estimatedTime,
      tags: ['ai-generated']
    }

    onApplySuggestion(todoData)
    onClose()
  }

  const generateSuggestions = (baseResult: any) => {
    const suggestions = [baseResult.suggestions]

    // 약간 변형된 제안들 생성
    if (baseResult.suggestions.estimatedTime > 30) {
      suggestions.push({
        ...baseResult.suggestions,
        estimatedTime: Math.max(15, baseResult.suggestions.estimatedTime - 15),
        title: `${baseResult.suggestions.title} (단축 버전)`,
        reasoning: `시간을 단축한 버전: ${baseResult.suggestions.reasoning}`
      })
    }

    return suggestions
  }

  return (
    <div className="ai-panel-overlay">
      <div className="ai-panel">
        <div className="panel-header">
          <h2>🤖 AI 할 일 분석</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="panel-content">
          <div className="input-section">
            <label>분석할 텍스트 입력:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="해야 할 일을 설명해주세요. 예: '내일까지 보고서 작성하고 팀 미팅 준비하기'"
              rows={4}
            />
            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || analyzing}
              className="btn-analyze"
            >
              {analyzing ? '분석 중...' : 'AI 분석 시작'}
            </button>
          </div>

          {analyzing && (
            <div className="analyzing-indicator">
              <div className="spinner"></div>
              <p>AI가 당신의 요청을 분석하고 있어요...</p>
            </div>
          )}

          {analysisResult && !analyzing && (
            <div className="results-section">
              <h3>분석 결과</h3>

              <div className="analysis-summary">
                <div className="confidence-meter">
                  <span>신뢰도: {Math.round(analysisResult.overallConfidence * 100)}%</span>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${analysisResult.overallConfidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="suggestions-list">
                {generateSuggestions(analysisResult).map((suggestion, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${selectedSuggestion === index ? 'selected' : ''}`}
                    onClick={() => setSelectedSuggestion(index)}
                  >
                    <div className="suggestion-header">
                      <h4>{suggestion.title}</h4>
                      <div className="suggestion-badges">
                        <span className={`badge priority-${suggestion.priority}`}>
                          {suggestion.priority === 'high' ? '높음' :
                           suggestion.priority === 'medium' ? '중간' : '낮음'}
                        </span>
                        <span className="badge category">{suggestion.category}</span>
                        <span className="badge time">{suggestion.estimatedTime}분</span>
                      </div>
                    </div>
                    <p className="suggestion-reasoning">{suggestion.reasoning}</p>
                  </div>
                ))}
              </div>

              <div className="action-buttons">
                <button onClick={handleApplySuggestion} className="btn-apply">
                  선택한 제안 적용하기
                </button>
                <button onClick={() => setAnalysisResult(null)} className="btn-reset">
                  다시 분석하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIAnalysisPanel
