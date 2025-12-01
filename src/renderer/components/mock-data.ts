import { Todo } from './types';

// 오늘 날짜 가져오기
const today = new Date();
today.setHours(0, 0, 0, 0);

// 내일 날짜
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// 모레 날짜
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

export const MOCK_TODOS: Todo[] = [
  // 오늘 일정
  {
    id: 1,
    text: '알고리즘 문제 풀기',
    category: 'study',
    completed: false,
    isPinned: true, // 고정됨
    dueDate: today,
    dueTime: '14:00',
    createdAt: new Date()
  },
  {
    id: 2,
    text: '영어 공부',
    category: 'study',
    completed: false,
    isPinned: false,
    dueDate: today,
    dueTime: '16:00',
    createdAt: new Date()
  },
  {
    id: 3,
    text: '운동하기',
    category: 'health',
    completed: true,
    isPinned: true, // 고정됨
    dueDate: today,
    dueTime: '07:00',
    createdAt: new Date()
  },
  {
    id: 4,
    text: '프로젝트 미팅',
    category: 'schedule',
    completed: false,
    isPinned: false,
    dueDate: today,
    dueTime: '15:00',
    createdAt: new Date()
  },
  
  // 내일 일정
  {
    id: 5,
    text: '요가 수업',
    category: 'health',
    completed: false,
    isPinned: false,
    dueDate: tomorrow,
    dueTime: '10:00',
    createdAt: new Date()
  },
  {
    id: 6,
    text: '책 읽기',
    category: 'self-dev',
    completed: false,
    isPinned: false,
    dueDate: tomorrow,
    createdAt: new Date()
  },
  {
    id: 7,
    text: '블로그 포스팅',
    category: 'self-dev',
    completed: false,
    isPinned: false,
    dueDate: tomorrow,
    dueTime: '20:00',
    createdAt: new Date()
  },
  
  // 모레 일정
  {
    id: 8,
    text: '장보기',
    category: 'etc',
    completed: false,
    isPinned: false,
    dueDate: dayAfterTomorrow,
    createdAt: new Date()
  }
];