import { Todo } from '../types';
import {ParsedTodo} from '../../../main/parser';

interface UseTodoActionsProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setIsLoading: (loading: boolean) => void;
  mapDbTodoToUiTodo: (dbTodo: any) => Todo;
  showAlert: (title: string, message: string) => void;
}

export function useTodoActions({
  todos,
  setTodos,
  setIsLoading,
  mapDbTodoToUiTodo,
  showAlert,
}: UseTodoActionsProps) {
  // TODO 추가
  const addTodo = async (
    parsed: ParsedTodo,
    manualDueDate?: Date | null,
    dueTime?: string | null
  ) => {
    setIsLoading(true);

    try {
      const hasManualTime = !!dueTime;

      // GPT가 분석한 title / category / dueDate / alertTime + 수동 입력 시간을 메인으로 전달
      const createInput = {
        title: parsed.title,
        category: parsed.category ?? null,
        // 시간이 직접 선택된 경우에만 manualDueDate 우선 적용
        // 그 외에는 GPT가 분석한 dueDate를 그대로 사용
        dueDate: hasManualTime
          ? (manualDueDate ?? parsed.dueDate ?? null)
          : (parsed.dueDate ?? manualDueDate ?? null),
        dueTime: hasManualTime ? dueTime : null,
        alertTime: parsed.alertTime ?? null,
        priority: null,
        // null 불가 → undefined로 유지
        tags: undefined,
      };

      const response = await window.api.todo.create(createInput);

      if (!response.success || !response.data) {
        showAlert('저장 실패', '할 일 저장에 실패했습니다.');
        return;
      }

      const created = mapDbTodoToUiTodo(response.data);
      setTodos((prev) => [...prev, created]);
    } catch (error) {
      console.error('Error creating todo:', error);
      showAlert('오류 발생', '할 일 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  // 완료 상태 토글
  const toggleComplete = async (id: number) => {
    try {
      const response = await window.api.todo.toggleComplete(id);
      if (!response.success || !response.data) {
        console.error('Failed to toggle complete:', response.error);
        return;
      }

      const updated = mapDbTodoToUiTodo(response.data);
      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  // 고정 핀 토글
  const togglePin = async (id: number) => {
    try {
      const target = todos.find(t => t.id === id);
      if (!target) return;

      const response = await window.api.todo.update(id, {
        pinned: !target.isPinned,
      } as any);

      if (!response.success || !response.data) {
        console.error('Failed to toggle pin:', response.error);
        return;
      }

      const updated = mapDbTodoToUiTodo(response.data);
      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  // TODO 삭제
  const deleteTodo = async (id: number) => {
    try {
      const response = await window.api.todo.delete(id);
      if (!response.success) {
        console.error('Failed to delete todo:', response.error);
        showAlert('삭제 실패', '삭제에 실패했습니다.');
        return;
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      showAlert('오류 발생', '삭제 중 오류가 발생했습니다.');
    }
  };

  // TODO 텍스트 수정
  const editTodo = async (id: number, newText: string) => {
    try {
      const response = await window.api.todo.update(id, {
        title: newText,
      } as any);

      if (!response.success || !response.data) {
        console.error('Failed to edit todo:', response.error);
        showAlert('수정 실패', '수정에 실패했습니다.');
        return;
      }

      const updated = mapDbTodoToUiTodo(response.data);
      setTodos(prev => prev.map(todo => (todo.id === id ? updated : todo)));
    } catch (error) {
      console.error('Error editing todo:', error);
      showAlert('오류 발생', '수정 중 오류가 발생했습니다.');
    }
  };

  return {
    addTodo,
    toggleComplete,
    togglePin,
    deleteTodo,
    editTodo,
  };
}
