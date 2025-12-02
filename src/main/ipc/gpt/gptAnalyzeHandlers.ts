import { analyzeTodoText } from '../../../../ai/analyzer'

// GPT를 사용해 Todo 한 줄을 분석하는 순수 함수
export async function gptAnalyzeTodo(text: string) {
  const result = await analyzeTodoText(text)
  return result
}


