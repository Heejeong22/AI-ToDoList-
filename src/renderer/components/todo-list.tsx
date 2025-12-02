import { useEffect, useState } from 'react';
import TextInput from './common/text-input';
import CategorySection from './category-section';
import { CATEGORIES } from './constants';
import { Todo } from './types';
import { getToday, getDateDisplayText, isSameDay } from './utils/date-utils';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());

  // DB Todo → UI Todo 매핑
  const mapDbTodoToUiTodo = (dbTodo: any): Todo => {
    const toDate = (value: any): Date => {
      if (value == null) return getToday();
      if (value instanceof Date) return value;
      if (typeof value === 'number') {
        // SQLite 정수(UNIX 초) → Date
        return new Date(value * 1000);
      }
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) return parsed;
      return getToday();
    };

    const dueDate = toDate(dbTodo.dueDate ?? dbTodo.due_date);
    const createdAt = toDate(dbTodo.createdAt ?? dbTodo.created_at);

    const toTimeString = (date: Date | null): string | undefined => {
      if (!date) return undefined;
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      if (h === '00' && m === '00') return undefined;
      return `${h}:${m}`;
    };

    return {
      id: dbTodo.id,
      text: dbTodo.title ?? dbTodo.text ?? '',
      category: dbTodo.category ?? 'etc',
      completed: Boolean(dbTodo.completed),
      isPinned: Boolean(dbTodo.pinned),
      dueDate,
      dueTime: toTimeString(dueDate),
      createdAt,
    };
  };

  // 마운트 시 DB에서 Todo 불러오기
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await window.api.todo.getAll();
        if (response.success && response.data) {
          const mapped = response.data.map((t: any) => mapDbTodoToUiTodo(t));
          setTodos(mapped);
        } else {
          console.error('Failed to load todos:', response.error);
        }
      } catch (error) {
        console.error('Error loading todos from DB:', error);
      }
    };

    loadTodos();
  }, []);

  // TODO 추가 핸들러 (DB + AI 카테고리)
  const handleAddTodo = async (text: string, dueDate: Date, dueTime?: string) => {
    try {
      const fullDueDate = new Date(dueDate);
      if (dueTime) {
        const [h, m] = dueTime.split(':').map(Number);
        if (!Number.isNaN(h) && !Number.isNaN(m)) {
          fullDueDate.setHours(h, m, 0, 0);
        }
      }

      const response = await window.api.todo.create({
        title: text,
        dueDate: fullDueDate,
      } as any);

      if (!response.success || !response.data) {
        console.error('Failed to create todo:', response.error);
        alert('할 일 저장에 실패했습니다.');
        return;
      }

      const created = mapDbTodoToUiTodo(response.data);
      setTodos(prev => [...prev, created]);
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('할 일 저장 중 오류가 발생했습니다.');
    }
  };

  // 완료 상태 토글 (DB 반영)
  const toggleComplete = async (id: number) => {
    try {
      const response = await window.api.todo.toggleComplete(id);
      if (!response.success || !response.data) {
        console.error('Failed to toggle complete:', response.error);
        return;
      }

      const updated = mapDbTodoToUiTodo(response.data);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? updated : todo)),
      );
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  // 고정 핀 토글 (DB 반영)
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
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? updated : todo)),
      );
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  // TODO 삭제 (DB 반영)
  const deleteTodo = async (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;

    const confirmMessage = `"${todoToDelete.text}"을(를) 삭제하시겠습니까?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await window.api.todo.delete(id);
      if (!response.success) {
        console.error('Failed to delete todo:', response.error);
        alert('삭제에 실패했습니다.');
        return;
      }

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 선택된 날짜의 TODO + 고정된 TODO 필터링
  const getFilteredTodos = () => {
    return todos.filter(todo => 
      // 고정된 항목이거나 선택된 날짜의 항목
      todo.isPinned || isSameDay(todo.dueDate, selectedDate)
    );
  };

  // 카테고리별로 TODO 그룹화 (선택된 날짜 + 고정 항목)
  const getTodosByCategory = (category: string) => {
    const filtered = getFilteredTodos().filter(todo => todo.category === category);
    
    // 고정된 항목을 최상단으로 정렬
    return filtered.sort((a, b) => {
      // 고정 여부로 먼저 정렬
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // 둘 다 고정되거나 둘 다 고정 안됨 -> 시간순 정렬
      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime);
      }
      if (a.dueTime && !b.dueTime) return -1;
      if (!a.dueTime && b.dueTime) return 1;
      
      return 0;
    });
  };

  // 날짜 변경 핸들러
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // 오늘로 돌아가기
  const goToToday = () => {
    setSelectedDate(getToday());
  };

  const filteredTodos = getFilteredTodos();
  const totalTodos = filteredTodos.length;
  const completedTodos = filteredTodos.filter(todo => todo.completed).length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-3 py-3">
        <h1 className="text-lg font-bold text-gray-800 mb-2">AI TODO</h1>
        
        {/* 날짜 네비게이션 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <span className="text-gray-600">◀</span>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-base font-semibold text-gray-800">
              {getDateDisplayText(selectedDate)}
            </span>
            <span className="text-xs text-gray-500">
              {totalTodos > 0 ? `${completedTodos}/${totalTodos} 완료` : '일정 없음'}
            </span>
          </div>
          
          <button
            onClick={() => changeDate(1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <span className="text-gray-600">▶</span>
          </button>
        </div>
        
        {/* 오늘로 돌아가기 버튼 */}
        {!isSameDay(selectedDate, getToday()) && (
          <button
            onClick={goToToday}
            className="w-full mt-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            오늘로 돌아가기
          </button>
        )}
      </div>

      {/* TODO 리스트 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto p-3">
        {totalTodos === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-4xl mb-2">📅</span>
            <span className="text-sm">이 날짜에 일정이 없습니다</span>
          </div>
        ) : (
          <div className="space-y-2">
            {CATEGORIES.map(category => {
              const categoryTodos = getTodosByCategory(category.value);
              // 해당 카테고리에 TODO가 있을 때만 표시
              if (categoryTodos.length === 0) return null;
              
              return (
                <CategorySection
                  key={category.value}
                  categoryValue={category.value}
                  categoryLabel={category.label}
                  categoryIcon={category.icon}
                  todos={categoryTodos}
                  onToggleComplete={toggleComplete}
                  onTogglePin={togglePin}
                  onDelete={deleteTodo}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 입력창 - 하단 고정 */}
      <div className="bg-white border-t border-gray-200 p-3 shadow-lg">
        <TextInput
          placeholder="할 일을 입력하세요..."
          maxLength={100}
          rows={2}
          onSubmit={handleAddTodo}
          defaultDate={selectedDate}
        />
      </div>
    </div>
  );
}