import { useState } from 'react';
import TodoList from './components/todo-list';
import { useShortcuts } from './components/hooks/use-shortcuts';

declare global {
  interface Window {
    api: typeof window.api;
  }
}

export default function App() {
  const [showTodoForm, setShowTodoForm] = useState(false);

  // 단축키 관리 (커스텀 훅으로 분리)
  useShortcuts({
    onNewTodo: () => {
      setShowTodoForm(prev => !prev);
    },
    onAiAnalysis: () => {
      alert('AI 분석 패널 (구현 예정)');
    },
    onSearch: () => {
      alert('검색 기능 (구현 예정)');
    },
  });

  return (
    <div className="w-full h-screen bg-bg-primary">
      {showTodoForm && (
        <div className="absolute top-4 right-4 z-50 p-4 bg-bg-secondary rounded-lg shadow-lg border-2 border-border">
          <p className="text-text-primary font-semibold">
            ✅ 단축키로 Todo 폼 토글됨! (Cmd/Ctrl+Shift+T)
          </p>
        </div>
      )}
      <TodoList />
    </div>
  );
}