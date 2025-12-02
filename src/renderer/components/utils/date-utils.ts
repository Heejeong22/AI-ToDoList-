/**
 * 날짜를 'YYYY-MM-DD' 형식으로 변환
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 오늘인지 확인
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

/**
 * 내일인지 확인
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
};

/**
 * 날짜 표시 텍스트 생성
 * 예: "오늘", "내일", "12월 5일 (목)"
 */
export const getDateDisplayText = (date: Date): string => {
  if (isToday(date)) return '오늘';
  if (isTomorrow(date)) return '내일';
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  
  return `${month}월 ${day}일 (${weekday})`;
};

/**
 * 시간 표시 텍스트 생성
 * 예: "14:00" -> "오후 2시", "09:30" -> "오전 9시 30분"
 */
export const getTimeDisplayText = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  
  if (minutes === 0) {
    return `${period} ${displayHours}시`;
  }
  return `${period} ${displayHours}시 ${minutes}분`;
};

/**
 * 오늘 날짜 객체 반환 (시간 00:00:00으로 초기화)
 */
export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * 날짜가 과거인지 확인
 */
export const isPast = (date: Date): boolean => {
  const today = getToday();
  return date < today;
};

/**
 * 날짜 차이 계산 (일 단위)
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = Math.floor((date2.getTime() - date1.getTime()) / oneDay);
  return diff;
};