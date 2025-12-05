// Todo 엔티티
export interface Todo {
  id: number;
  text: string;
  category: string;
  completed: boolean;
  isPinned: boolean;
  dueDate: Date;
  dueTime?: string; // 'HH:MM' 형식
  alertTime?: Date;
  createdAt: Date;
}

// 카테고리
export interface Category {
  value: string;
  label: string;
  icon: string;
}