// Todo 관련 타입
export interface Todo {
  id: number;
  text: string;
  category: string;
  completed: boolean;
  isPinned: boolean; // 고정 여부
  dueDate: Date; // 마감일 (필수)
  dueTime?: string; // 마감 시간 (옵션, 'HH:MM' 형식)
  alertTime?: Date; // 알림 시간
  createdAt: Date;
}

// 카테고리 관련 타입
export interface Category {
  value: string;
  label: string;
  color: string;
  icon: string;
}

// Props 타입들
export interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  isPinned: boolean;
  dueDate: Date;
  dueTime?: string;
  onToggleComplete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number, newText: string) => void;
}

export interface CategorySectionProps {
  categoryValue: string;
  categoryLabel: string;
  categoryIcon: string;
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onAddTodo?: (text: string, dueTime?: string) => void;
  selectedDate: Date;
  isExpanded: boolean;
  onToggleExpand: (categoryValue: string) => void;
}

export interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onSubmit: (value: string, dueDate: Date, dueTime?: string) => void;
  defaultDate: Date;
}