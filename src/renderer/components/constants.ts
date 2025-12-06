import { Category } from './types';

// 스케줄(시간 기반) 블록 – 카테고리라기보다는 "시간이 있는 일정" 뷰
export const SCHEDULE_CATEGORY: Category = {
  value: 'schedule',
  label: '스케줄',
  icon: '📅',
};

// 실제 카테고리 정의 (학업/자기개발/건강/기타)
export const CATEGORIES: Category[] = [
  { value: 'study', label: '학업', icon: '📚' },
  { value: 'self-dev', label: '자기개발', icon: '🚀' },
  { value: 'health', label: '건강', icon: '💪' },
  { value: 'etc', label: '기타', icon: '📌' },
];

// 카테고리 정보 가져오기
export const getCategoryInfo = (categoryValue: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.value === categoryValue);
};

// 카테고리 값 배열
export const CATEGORY_VALUES = CATEGORIES.map(cat => cat.value);

// 기본 카테고리
export const DEFAULT_CATEGORY = 'etc';