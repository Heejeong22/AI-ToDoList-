import { gptAnalyzeTodo } from './gptAnalyzeHandlers'

// 필요 시: GPT 결과에서 카테고리/우선순위만 뽑아내고 싶을 때 사용할 수 있는 헬퍼
// 현재는 사용처가 없어서 단순 래퍼로만 구현
export async function gptClassify(text: string) {
  const result = await gptAnalyzeTodo(text)
  return result
}



