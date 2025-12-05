import { analyzeTodoText } from '../../../../ai/analyzer'

// 간단한 AI 분석 함수들 (실제로는 OpenAI API나 다른 AI 서비스를 사용)
export function analyzePriority(
  title: string,
  description?: string,
): { priority: 'low' | 'medium' | 'high'; confidence: number } {
  const text = `${title} ${description || ''}`.toLowerCase()

  // 간단한 키워드 기반 분석
  if (text.includes('urgent') || text.includes('긴급') || text.includes('asap')) {
    return { priority: 'high', confidence: 0.8 }
  }

  if (text.includes('important') || text.includes('중요') || text.includes('deadline')) {
    return { priority: 'high', confidence: 0.7 }
  }

  if (text.includes('review') || text.includes('check') || text.includes('검토')) {
    return { priority: 'medium', confidence: 0.6 }
  }

  return { priority: 'medium', confidence: 0.5 }
}

// 프론트/DB에서 사용하는 카테고리 value 기준 분류기
// CATEGORIES: study, self-dev, health, schedule, etc
export function analyzeCategory(
  title: string,
  description?: string,
): { category: string; confidence: number } {
  const text = `${title} ${description || ''}`.toLowerCase()

  // 건강 관련 키워드 → health
  if (
    text.includes('운동') ||
    text.includes('헬스') ||
    text.includes('health') ||
    text.includes('walk') ||
    text.includes('걷기') ||
    text.includes('조깅') ||
    text.includes('러닝') ||
    text.includes('요가') ||
    text.includes('필라테스')
  ) {
    return { category: 'health', confidence: 0.8 }
  }

  // 학업/공부 → study
  if (
    text.includes('study') ||
    text.includes('학습') ||
    text.includes('공부') ||
    text.includes('과제') ||
    text.includes('숙제') ||
    text.includes('시험') ||
    text.includes('시험공부')
  ) {
    return { category: 'study', confidence: 0.75 }
  }

  // 자기계발 / 사이드 프로젝트 → self-dev
  if (
    text.includes('자기개발') ||
    text.includes('자기 개발') ||
    text.includes('side project') ||
    text.includes('사이드 프로젝트') ||
    text.includes('블로그') ||
    text.includes('독서') ||
    text.includes('책읽기') ||
    text.includes('포트폴리오')
  ) {
    return { category: 'self-dev', confidence: 0.7 }
  }

  // 스케줄/약속/회의 → schedule
  if (
    text.includes('회의') ||
    text.includes('meeting') ||
    text.includes('약속') ||
    text.includes('스케줄') ||
    text.includes('일정') ||
    text.includes('세미나') ||
    text.includes('모임')
  ) {
    return { category: 'schedule', confidence: 0.7 }
  }

  // 그 외 → etc
  return { category: 'etc', confidence: 0.4 }
}

export function estimateTime(
  title: string,
  description?: string,
): { estimatedMinutes: number; confidence: number } {
  const text = `${title} ${description || ''}`.toLowerCase()

  // 간단한 시간 추정
  if (text.includes('quick') || text.includes('짧게') || text.includes('간단')) {
    return { estimatedMinutes: 15, confidence: 0.6 }
  }

  if (text.includes('long') || text.includes('길게') || text.includes('complex')) {
    return { estimatedMinutes: 120, confidence: 0.5 }
  }

  if (text.includes('meeting') || text.includes('회의')) {
    return { estimatedMinutes: 60, confidence: 0.7 }
  }

  if (text.includes('review') || text.includes('검토')) {
    return { estimatedMinutes: 30, confidence: 0.6 }
  }

  return { estimatedMinutes: 45, confidence: 0.4 }
}

// 자연어 입력을 GPT로 한 번에 파싱하고 싶을 때 사용할 수 있는 헬퍼
export async function analyzeWithGpt(input: string) {
  try {
    const result = await analyzeTodoText(input)
    return result
  } catch (error) {
    console.error('Error in GPT analyze helper:', error)
    return null
  }
}



