import React from 'react'
import '../styles/Header.css'

interface HeaderProps {
  onSearch: (query: string) => void
  onToggleAIPanel: () => void
}

const Header: React.FC<HeaderProps> = ({ onSearch, onToggleAIPanel }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">🤖 AI TodoList</h1>
      </div>

      <div className="header-center">
        <div className="search-box">
          <input
            type="text"
            placeholder="할 일 검색..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="header-right">
        <button
          onClick={onToggleAIPanel}
          className="btn-ai-panel"
          title="AI 분석 패널"
        >
          🤖 AI 분석
        </button>

        <button
          className="btn-settings"
          title="설정"
        >
          ⚙️
        </button>
      </div>
    </header>
  )
}

export default Header
