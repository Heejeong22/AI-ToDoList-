import { useEffect, useState } from 'react';
import TextInput from './common/text-input';
import CategorySection from './category-section';
import ExpandCollapseButton from './common/expand-collapse-button';
import { CATEGORIES } from './constants';
import { Todo } from './types';
import { getToday, getDateDisplayText, isSameDay } from './utils/date-utils';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  
  // 확장된 카테고리 Set (categoryValue 저장)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(cat => cat.value)) // 처음엔 모두 확장
  );


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

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  // 개별 카테고리 토글
  const toggleCategoryExpand = (categoryValue: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryValue)) {
        newSet.delete(categoryValue);
      } else {
        newSet.add(categoryValue);
      }
      return newSet;
    });
  };

  // 전체 확장/축소 토글
  const toggleAllCategories = () => {
    if (expandedCategories.size > 0) {
      // 하나라도 확장되어 있으면 모두 축소
      setExpandedCategories(new Set());
    } else {
      // 모두 축소되어 있으면 모두 확장
      setExpandedCategories(new Set(CATEGORIES.map(cat => cat.value)));
    }
  };

  const getFilteredTodos = () => {
    return todos.filter(todo => 
      todo.isPinned || isSameDay(todo.dueDate, selectedDate)
    );
  };

  const getTodosByCategory = (category: string) => {
    const filtered = getFilteredTodos();
    
    let categoryTodos: Todo[];
    if (category === 'schedule') {
      categoryTodos = filtered.filter(todo => todo.dueTime);
    } else {
      categoryTodos = filtered.filter(todo => todo.category === category);
    }
    
    return categoryTodos.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime);
      }
      if (a.dueTime && !b.dueTime) return -1;
      if (!a.dueTime && b.dueTime) return 1;
      
      return 0;
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(getToday());
  };

  const filteredTodos = getFilteredTodos();
  const totalTodos = filteredTodos.length;
  const completedTodos = filteredTodos.filter(todo => todo.completed).length;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#FEFDFB' }}>
      {/* 헤더 */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid #E5DCC8' }}>
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold" style={{ color: '#010D00' }}>
              TODO
            </h1>
            
            {/* 전체 확장/축소 버튼 */}
            <ExpandCollapseButton
              expandedCategories={expandedCategories}
              totalCategories={CATEGORIES.length}
              onToggleAll={toggleAllCategories}
            />
          </div>
          
          {/* 날짜 네비게이션 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded transition-colors"
              style={{ 
                backgroundColor: 'transparent',
                color: '#736A5A'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium" style={{ color: '#010D00' }}>
                {getDateDisplayText(selectedDate)}
              </span>
              <span className="text-sm mt-0.5" style={{ color: '#8C8270' }}>
                {totalTodos > 0 ? `${completedTodos}/${totalTodos}` : '일정 없음'}
              </span>
            </div>
            
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded transition-colors"
              style={{ 
                backgroundColor: 'transparent',
                color: '#736A5A'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* 돌아가기 버튼 */}
          {!isSameDay(selectedDate, getToday()) && (
            <button
              onClick={goToToday}
              className="w-full mt-3 py-2 text-sm rounded transition-colors flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: '#F2E8D5',
                color: '#736A5A'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>돌아가기</span>
            </button>
          )}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-full mx-auto px-6 py-6">
          {totalTodos === 0 && todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64" style={{ color: '#8C8270' }}>
              <span className="text-4xl mb-2">📋</span>
              <span className="text-base">할 일을 추가해보세요</span>
            </div>
          ) : (
            <div className="space-y-4">
              {CATEGORIES.map(category => {
                const categoryTodos = getTodosByCategory(category.value);
                
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
                    onEdit={editTodo}
                    onAddTodo={(text, dueTime) => handleAddTodo(text, selectedDate, dueTime, category.value)}
                    selectedDate={selectedDate}
                    isExpanded={expandedCategories.has(category.value)}
                    onToggleExpand={toggleCategoryExpand}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 하단 입력창 */}
      <div className="p-4" style={{ borderTop: '1px solid #E5DCC8' }}>
        <div className="max-w-full mx-auto">
          <TextInput
            placeholder="할 일을 입력하세요..."
            maxLength={100}
            rows={1}
            onSubmit={(text, dueDate, dueTime) => handleAddTodo(text, dueDate, dueTime)}
            defaultDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}