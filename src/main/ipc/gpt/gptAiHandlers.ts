import { IpcMain } from 'electron'
import { gptAnalyzeTodo } from './gptAnalyzeHandlers'

// GPT 관련 IPC 등록
export function setupGptAiHandlers(ipcMain: IpcMain) {
  ipcMain.handle('gptAI:analyzeTodo', async (_event, text: string) => {
    console.log('📩 [IPC] GPT Todo 분석 요청:', text)

    try {
      const result = await gptAnalyzeTodo(text)

      console.log('📤 [IPC] GPT 분석 결과:', result)

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('❌ GPT Todo 분석 실패:', error)

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown GPT error',
      }
    }
  })
}


