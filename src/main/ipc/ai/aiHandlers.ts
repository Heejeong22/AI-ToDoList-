import { IpcMain } from 'electron'
import {
  analyzePriority,
  analyzeCategory,
  estimateTime,
} from './analyzeCategoryHandlers'
import { parseNaturalInput } from './parseNaturalInputHandlers'

// ai 관련 IPC들을 한 곳에서 등록
export function setupAiHandlers(ipcMain: IpcMain): void {
  // Todo 우선순위 분석
  ipcMain.handle('ai:analyzePriority', async (_event, { title, description }) => {
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
            reasoning: `${title}의 내용을 분석한 결과 ${analysis.priority} 우선순위로 분류됩니다.`,
          },
        },
      }
    } catch (error) {
      console.error('Error analyzing priority:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 카테고리 분석
  ipcMain.handle('ai:analyzeCategory', async (_event, { title, description }) => {
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
            reasoning: `${title}의 내용을 분석한 결과 '${analysis.category}' 카테고리로 분류됩니다.`,
          },
        },
      }
    } catch (error) {
      console.error('Error analyzing category:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // Todo 예상 시간 분석
  ipcMain.handle('ai:estimateTime', async (_event, { title, description }) => {
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
            reasoning: `${title} 작업의 예상 소요 시간은 ${analysis.estimatedMinutes}분입니다.`,
          },
        },
      }
    } catch (error) {
      console.error('Error estimating time:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 종합 AI 분석 (우선순위 + 카테고리 + 시간)
  ipcMain.handle('ai:analyzeComprehensive', async (_event, { title, description }) => {
    try {
      const priorityAnalysis = analyzePriority(title, description)
      const categoryAnalysis = analyzeCategory(title, description)
      const timeAnalysis = estimateTime(title, description)

      const comprehensiveResult = {
        priority: priorityAnalysis,
        category: categoryAnalysis,
        estimatedTime: timeAnalysis,
        overallConfidence:
          (priorityAnalysis.confidence +
            categoryAnalysis.confidence +
            timeAnalysis.confidence) / 3,
        suggestions: {
          title,
          priority: priorityAnalysis.priority,
          category: categoryAnalysis.category,
          estimatedTime: timeAnalysis.estimatedMinutes,
          reasoning: `${title} 작업을 종합적으로 분석한 결과: ${priorityAnalysis.priority} 우선순위, '${categoryAnalysis.category}' 카테고리, 예상 ${timeAnalysis.estimatedMinutes}분 소요로 분류됩니다.`,
        },
      }

      return {
        success: true,
        data: comprehensiveResult,
      }
    } catch (error) {
      console.error('Error in comprehensive analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 자연어 입력 파서 (GPT 기반)
  ipcMain.handle('ai:parseNaturalInput', parseNaturalInput)
}


