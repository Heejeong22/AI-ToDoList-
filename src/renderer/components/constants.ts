import { Category } from './types';

// 카테고리 정의
export const CATEGORIES: Category[] = [
  { value: 'schedule', label: '스케줄', icon: '📅' },
  { value: 'study', label: '학업', icon: '📚' },
  { value: 'self-dev', label: '자기개발', icon: '🚀' },
  { value: 'health', label: '건강', icon: '💪' },
  { value: 'etc', label: '기타', icon: '📌' }
];

// 카테고리 정보 가져오기
export const getCategoryInfo = (categoryValue: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.value === categoryValue);
};

// 카테고리 값 배열
export const CATEGORY_VALUES = CATEGORIES.map(cat => cat.value);

// 기본 카테고리
export const DEFAULT_CATEGORY = 'etc';