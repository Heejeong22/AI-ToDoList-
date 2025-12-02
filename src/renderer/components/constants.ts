import { Category } from './types';

export const CATEGORIES: Category[] = [
  { value: 'schedule', label: '스케줄', color: 'bg-green-500', icon: '📅' },
  { value: 'study', label: '학업', color: 'bg-blue-500', icon: '📚' },
  { value: 'self-dev', label: '자기개발', color: 'bg-purple-500', icon: '🚀' },
  { value: 'health', label: '건강', color: 'bg-red-500', icon: '💪' },
  { value: 'etc', label: '기타', color: 'bg-yellow-500', icon: '📌' }
];

export const getCategoryInfo = (categoryValue: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.value === categoryValue);
};