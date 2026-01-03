import { Todo } from '../types';
import { isSameDay } from '../utils/date-utils';

interface UseTodoFiltersProps {
  todos: Todo[];
  selectedDate: Date;
}

export function useTodoFilters({ todos, selectedDate }: UseTodoFiltersProps) {
  
  // 선택된 날짜의 TODO 필터링
  const getFilteredTodos = () => {
    return todos.filter(todo => 
      todo.isPinned || isSameDay(todo.dueDate, selectedDate)
    );
  };

  // 시간(스케줄) 있는 TODO만 가져오기
  const getScheduledTodos = () => {
    const filtered = getFilteredTodos();
    const scheduled = filtered.filter(todo => todo.dueTime);

    // 정렬: 고정 → 시간순
    return scheduled.sort((a, b) => {
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

  // 카테고리별 TODO 가져오기
  const getTodosByCategory = (category: string) => {
    const filtered = getFilteredTodos();


    let categoryTodos: Todo[];
    if (category === 'schedule') {
      // 스케줄: 시간이 설정된 todo만
      categoryTodos = filtered.filter(todo => todo.dueTime);
    } else {
      // 다른 카테고리: 해당 카테고리인 todo (시간 있어도 표시)
      categoryTodos = filtered.filter(todo => todo.category === category);
    }

    
    // 정렬: 고정 → 시간순
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

  // 통계 계산
  const getStats = () => {
    const filteredTodos = getFilteredTodos();
    const totalTodos = filteredTodos.length;
    const completedTodos = filteredTodos.filter(todo => todo.completed).length;
    
    return { totalTodos, completedTodos };
  };

  return {
    getFilteredTodos,
    getScheduledTodos,
    getTodosByCategory,
    getStats,
  };
}