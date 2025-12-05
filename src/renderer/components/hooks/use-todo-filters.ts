import { Todo } from '../types';
import { isSameDay } from '../utils/date-utils';

interface UseTodoFiltersProps {
  todos: Todo[];
  selectedDate: Date;
}

// 텍스트 기반 카테고리 추론 (메인 프로세스의 analyzeCategory와 규칙 맞추기)
const inferCategoryFromText = (text: string): string | null => {
  const lower = text.toLowerCase();

  // 건강 관련 키워드 → health
  if (
    lower.includes('운동') ||
    lower.includes('헬스') ||
    lower.includes('health') ||
    lower.includes('walk') ||
    lower.includes('걷기') ||
    lower.includes('조깅') ||
    lower.includes('러닝') ||
    lower.includes('요가') ||
    lower.includes('필라테스')
  ) {
    return 'health';
  }

  // 학업/공부 → study
  if (
    lower.includes('study') ||
    lower.includes('학습') ||
    lower.includes('공부') ||
    lower.includes('과제') ||
    lower.includes('숙제') ||
    lower.includes('시험') ||
    lower.includes('시험공부')
  ) {
    return 'study';
  }

  // 자기계발 / 사이드 프로젝트 → self-dev
  if (
    lower.includes('자기개발') ||
    lower.includes('자기 개발') ||
    lower.includes('side project') ||
    lower.includes('사이드 프로젝트') ||
    lower.includes('블로그') ||
    lower.includes('독서') ||
    lower.includes('책읽기') ||
    lower.includes('포트폴리오')
  ) {
    return 'self-dev';
  }

  // 스케줄/약속/회의 → schedule
  if (
    lower.includes('회의') ||
    lower.includes('meeting') ||
    lower.includes('약속') ||
    lower.includes('스케줄') ||
    lower.includes('일정') ||
    lower.includes('세미나') ||
    lower.includes('모임')
  ) {
    return 'schedule';
  }

  return null;
};

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