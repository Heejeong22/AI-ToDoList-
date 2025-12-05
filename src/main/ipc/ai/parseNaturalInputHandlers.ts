import { IpcMainInvokeEvent } from 'electron'
import { analyzeTodoText } from '../../../../ai/analyzer'

// 자연어 한 줄 입력을 받아서
// title / date / time / category 등을 JSON 형태로 파싱
export async function parseNaturalInput(
  _event: IpcMainInvokeEvent,
  text: string,
) {
  try {
    const result = await analyzeTodoText(text)
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error parsing natural input:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}



