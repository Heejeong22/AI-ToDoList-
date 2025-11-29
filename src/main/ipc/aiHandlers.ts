import { IpcMain } from 'electron'
import { db } from '../db/drizzle'

// 간단한 AI 분석 함수들 (실제로는 OpenAI API나 다른 AI 서비스를 사용)
function analyzePriority(title: string, description?: string): { priority: 'low' | 'medium' | 'high', confidence: number } {
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

function analyzeCategory(title: string, description?: string): { category: string, confidence: number } {
  const text = `${title} ${description || ''}`.toLowerCase()

  // 간단한 카테고리 분류
  if (text.includes('work') || text.includes('업무') || text.includes('meeting')) {
    return { category: '업무', confidence: 0.7 }
  }

  if (text.includes('study') || text.includes('학습') || text.includes('공부')) {
    return { category: '학습', confidence: 0.7 }
  }

  if (text.includes('personal') || text.includes('개인') || text.includes('health')) {
    return { category: '개인', confidence: 0.6 }
  }

  return { category: '기타', confidence: 0.4 }
}

function estimateTime(title: string, description?: string): { estimatedMinutes: number, confidence: number } {
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

export function setupAiHandlers(ipcMain: IpcMain): void {
  // Todo 우선순위 분석
  ipcMain.handle('ai:analyzePriority', async (_, { title, description }) => {
    try {
      const analysis = analyzePriority(title, description)

      return {
        success: true,
        data: {
          type: 'priority',
          result: analysis.priority,
          confidence: analysis.confidence,
          suggestions: {
            priority: analysis.priority,
            reasoning: `${title}의 내용을 분석한 결과 ${analysis.priority} 우선순위로 분류됩니다.`
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing priority:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Todo 카테고리 분석
  ipcMain.handle('ai:analyzeCategory', async (_, { title, description }) => {
    try {
      const analysis = analyzeCategory(title, description)

      return {
        success: true,
        data: {
          type: 'category',
          result: analysis.category,
          confidence: analysis.confidence,
          suggestions: {
            category: analysis.category,
            reasoning: `${title}의 내용을 분석한 결과 '${analysis.category}' 카테고리로 분류됩니다.`
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing category:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // Todo 예상 시간 분석
  ipcMain.handle('ai:estimateTime', async (_, { title, description }) => {
    try {
      const analysis = estimateTime(title, description)

      return {
        success: true,
        data: {
          type: 'time',
          result: analysis.estimatedMinutes,
          confidence: analysis.confidence,
          suggestions: {
            estimatedTime: analysis.estimatedMinutes,
            reasoning: `${title} 작업의 예상 소요 시간은 ${analysis.estimatedMinutes}분입니다.`
          }
        }
      }
    } catch (error) {
      console.error('Error estimating time:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 종합 AI 분석 (우선순위 + 카테고리 + 시간)
  ipcMain.handle('ai:analyzeComprehensive', async (_, { title, description }) => {
    try {
      const priorityAnalysis = analyzePriority(title, description)
      const categoryAnalysis = analyzeCategory(title, description)
      const timeAnalysis = estimateTime(title, description)

      const comprehensiveResult = {
        priority: priorityAnalysis,
        category: categoryAnalysis,
        estimatedTime: timeAnalysis,
        overallConfidence: (priorityAnalysis.confidence + categoryAnalysis.confidence + timeAnalysis.confidence) / 3,
        suggestions: {
          title,
          priority: priorityAnalysis.priority,
          category: categoryAnalysis.category,
          estimatedTime: timeAnalysis.estimatedMinutes,
          reasoning: `${title} 작업을 종합적으로 분석한 결과: ${priorityAnalysis.priority} 우선순위, '${categoryAnalysis.category}' 카테고리, 예상 ${timeAnalysis.estimatedMinutes}분 소요로 분류됩니다.`
        }
      }

      return {
        success: true,
        data: comprehensiveResult
      }
    } catch (error) {
      console.error('Error in comprehensive analysis:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // (단순 버전) 분석 결과는 DB에 저장하지 않고 응답만 반환
}
