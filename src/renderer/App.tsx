import { useEffect, useState } from 'react';
import TodoList from './components/todo-list';

export default function App() {
  const [showTodoForm, setShowTodoForm] = useState(false);

  // 전역 단축키 이벤트 리스너
  useEffect(() => {
    console.log('🔑 단축키 리스너 등록');

    // Ctrl+Shift+T: 새 Todo 추가
    const cleanup1 = window.api.onShortcut('new-todo', () => {
      console.log('🔑 새 Todo 단축키 눌림! (Cmd/Ctrl+Shift+T)');
      setShowTodoForm(prev => !prev);
    });

    // Ctrl+Shift+A: AI 분석
    const cleanup2 = window.api.onShortcut('ai-analysis', () => {
      console.log('🔑 AI 분석 단축키 눌림! (Cmd/Ctrl+Shift+A)');
      alert('AI 분석 패널 (구현 예정)');
    });

    // Ctrl+Shift+S: 검색
    const cleanup3 = window.api.onShortcut('search', () => {
      console.log('🔑 검색 단축키 눌림! (Cmd/Ctrl+Shift+S)');
      alert('검색 기능 (구현 예정)');
    });

    // Cleanup
    return () => {
      console.log('🔑 단축키 리스너 해제');
      cleanup1();
      cleanup2();
      cleanup3();
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 h-screen w-1/4 min-w-[400px] shadow-2xl">
      {showTodoForm && (
        <div className="absolute top-4 right-4 z-50 p-4 bg-blue-100 rounded-lg shadow-lg">
          <p className="text-blue-800 font-semibold">
            ✅ 단축키로 Todo 폼 토글됨! (Cmd/Ctrl+Shift+T)
          </p>
        </div>
      )}
      <TodoList />
    </div>
  );
}