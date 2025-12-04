import { useEffect } from 'react';

interface ShortcutCallbacks {
  onNewTodo?: () => void;
  onAiAnalysis?: () => void;
  onSearch?: () => void;
  onQuickAdd?: () => void;
}

export function useShortcuts(callbacks: ShortcutCallbacks) {
  useEffect(() => {
    console.log('🔑 단축키 리스너 등록');

    const cleanupFunctions: (() => void)[] = [];

    // Ctrl+Shift+T: 새 Todo 추가
    if (callbacks.onNewTodo) {
      const cleanup = window.api.onShortcut('new-todo', () => {
        console.log('🔑 새 Todo 단축키 눌림! (Cmd/Ctrl+Shift+T)');
        callbacks.onNewTodo?.();
      });
      cleanupFunctions.push(cleanup);
    }

    // Ctrl+Shift+A: AI 분석
    if (callbacks.onAiAnalysis) {
      const cleanup = window.api.onShortcut('ai-analysis', () => {
        console.log('🔑 AI 분석 단축키 눌림! (Cmd/Ctrl+Shift+A)');
        callbacks.onAiAnalysis?.();
      });
      cleanupFunctions.push(cleanup);
    }

    // Ctrl+Shift+S: 검색
    if (callbacks.onSearch) {
      const cleanup = window.api.onShortcut('search', () => {
        console.log('🔑 검색 단축키 눌림! (Cmd/Ctrl+Shift+S)');
        callbacks.onSearch?.();
      });
      cleanupFunctions.push(cleanup);
    }

    // Ctrl+Shift+Q: 빠른 TODO 추가
    if (callbacks.onQuickAdd) {
      const cleanup = window.api.onShortcut('quick-add', () => {
        console.log('🔑 빠른 추가 단축키 눌림! (Cmd/Ctrl+Shift+Q)');
        callbacks.onQuickAdd?.();
      });
      cleanupFunctions.push(cleanup);
    }

    // Cleanup
    return () => {
      console.log('🔑 단축키 리스너 해제');
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [callbacks]);
}