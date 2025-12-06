// parser.ts

export interface ParsedTodo {
  title: string;
  category: string | null;
  dueDate: string | null;
  alertTime: string | null;
}

/**
 * GPT 응답이 문자열(JSON)일 수도 있고, 이미 객체일 수도 있기 때문에
 * 입력이 어떤 형태든 안전하게 ParsedTodo로 변환한다.
 */
export function safeParseJSON(input: any): ParsedTodo | null {
  try {
    let parsed = input;

    // 1) 입력이 문자열이면 JSON.parse 실행
    if (typeof input === "string") {
      parsed = JSON.parse(input);
    }

    // 2) 입력이 객체지만 null인 경우 방어
    if (typeof parsed !== "object" || parsed === null) {
      console.error("❌ 파싱 실패: parsed 값이 객체가 아님:", parsed);
      return null;
    }

    // 3) 정상 반환
    return {
      title: parsed.title ?? "",
      category: parsed.category ?? null,
      dueDate: parsed.dueDate ?? null,
      alertTime: parsed.alertTime ?? null,
    };
  } catch (err) {
    console.error("❌ JSON 파싱 실패:", err);
    console.error("입력값:", input);
    return null;
  }
}
