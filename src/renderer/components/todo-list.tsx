import { useState } from 'react';
import TextInput from './common/text-input';
import CategorySection from './category-section';
import ExpandCollapseButton from './common/expand-collapse-button';
import { CATEGORIES } from './constants';
import { MOCK_TODOS } from './mock-data';
import { Todo } from './types';
import { getToday, getDateDisplayText, isSameDay } from './utils/date-utils';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  
  // 확장된 카테고리 Set (categoryValue 저장)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map(cat => cat.value)) // 처음엔 모두 확장
  );

  const handleAddTodo = (text: string, dueDate: Date, dueTime?: string, category?: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      category: category || 'etc',
      completed: false,
      isPinned: false,
      dueDate: dueDate,
      dueTime: dueTime,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const togglePin = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isPinned: !todo.isPinned } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;

    const confirmMessage = `"${todoToDelete.text}"을(를) 삭제하시겠습니까?`;
    if (window.confirm(confirmMessage)) {
      setTodos(todos.filter(todo => todo.id !== id));
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