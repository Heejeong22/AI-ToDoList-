import { useState, useEffect } from 'react';
import { Todo } from '../types';
import { getToday } from '../utils/date-utils';

// DB Todo → UI Todo 매핑
const mapDbTodoToUiTodo = (dbTodo: any): Todo => {
  const toDate = (value: any): Date => {
    if (value == null) return getToday();
    if (value instanceof Date) return value;
    if (typeof value === 'number') {
      return new Date(value * 1000);
    }

    const str = String(value).trim();

    // "YYYY-MM-DD"는 브라우저/런타임에 따라 UTC로 파싱되어 날짜가 하루 밀릴 수 있어 수동 파싱
    const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      return new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);
    }

    // "YYYY-MM-DD HH:MM" (DB 저장 포맷)
    const ymdHmMatch = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(str);
    if (ymdHmMatch) {
      const [, y, m, d, hh, mm] = ymdHmMatch;
      return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), 0, 0);
    }

    // "YYYY-MM-DDTHH:MM(:SS)[.sss][Z]?" (AI/기타 입력)
    const isoMatch =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?Z?$/.exec(str);
    if (isoMatch) {
      const [, y, m, d, hh, mm, ss] = isoMatch;
      return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), ss ? Number(ss) : 0, 0);
    }

    const parsed = new Date(str);
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

export function useTodoState() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // 마운트 시 DB에서 Todo 불러오기 + 첫 실행 확인
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

  return {
    todos,
    setTodos,
    selectedDate,
    setSelectedDate,
    expandedCategories,
    setExpandedCategories,
    isLoading,
    setIsLoading,
    mapDbTodoToUiTodo,
  };
}