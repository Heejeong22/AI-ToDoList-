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
    const str = String(value);
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(str)) {
      const iso = str.replace(' ', 'T');
      const parsed = new Date(iso);
      if (!Number.isNaN(parsed.getTime())) return parsed;
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