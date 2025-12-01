import { useEffect, useState } from 'react';
import TextInput from './components/common/TextInput';

export default function App() {
  const [showTodoForm, setShowTodoForm] = useState(false);

  // ⭐ Task 1: 전역 단축키 이벤트 리스너
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

  const handleSubmit = (value: string) => {
    console.log('입력받은 값:', value);
    alert(`입력한 내용: ${value}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">AI TODO 앱</h1>
      <p className="text-gray-600 mb-6">할 일을 입력하고 AI가 자동으로 분류해드립니다!</p>

      {showTodoForm && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800 font-semibold">
            ✅ 단축키로 Todo 폼 토글됨! (Cmd/Ctrl+Shift+T)
          </p>
        </div>
      )}

      <TextInput
        placeholder="할 일을 자유롭게 입력하세요."
        maxLength={100}
        rows={3}
        onSubmit={handleSubmit}
      />
    </div>
  );
}