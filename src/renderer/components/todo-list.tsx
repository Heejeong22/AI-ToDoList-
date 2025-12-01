import { useState } from 'react';
import TextInput from './common/text-input';
import CategorySection from './category-section';
import { CATEGORIES } from './constants';
import { MOCK_TODOS } from './mock-data';
import { Todo } from './types';
import { getToday, getDateDisplayText, isSameDay } from './utils/date-utils';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());

  // TODO 추가 핸들러
  const handleAddTodo = (text: string, dueDate: Date, dueTime?: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      category: 'etc', // 기본값 (나중에 AI가 분류)
      completed: false,
      isPinned: false,
      dueDate: dueDate,
      dueTime: dueTime,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
  };

  // 완료 상태 토글
  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 고정 핀 토글
  const togglePin = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isPinned: !todo.isPinned } : todo
    ));
  };

  // TODO 삭제
  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;

    const confirmMessage = `"${todoToDelete.text}"을(를) 삭제하시겠습니까?`;
    if (window.confirm(confirmMessage)) {
      setTodos(todos.filter(todo => todo.id !== id));
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