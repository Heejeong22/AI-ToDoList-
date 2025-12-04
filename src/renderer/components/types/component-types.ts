import { Todo } from './todo-types';

// TodoItem 컴포넌트 Props
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

// CategorySection 컴포넌트 Props
export interface CategorySectionProps {
  categoryValue: string;
  categoryLabel: string;
  categoryIcon: string;
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  selectedDate: Date;
  isExpanded: boolean;
  onToggleExpand: (categoryValue: string) => void;
}

// TextInput 컴포넌트 Props
export interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onSubmit: (value: string, dueDate: Date, dueTime?: string) => void;
  defaultDate: Date;
}

// AlertModal 컴포넌트 Props
export interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

// LoadingModal 컴포넌트 Props
export interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

// TutorialModal 컴포넌트 Props
export interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// DateTimePicker 컴포넌트 Props
export interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time?: string) => void;
  initialDate?: Date;
  initialTime?: string;
}

// HelpButton 컴포넌트 Props
export interface HelpButtonProps {
  onClick: () => void;
}

// ExpandCollapseButton 컴포넌트 Props
export interface ExpandCollapseButtonProps {
  expandedCategories: Set<string>;
  totalCategories: number;
  onToggleAll: () => void;
}