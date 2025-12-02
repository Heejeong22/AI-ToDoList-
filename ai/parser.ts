// parser.ts

export interface ParsedTodo {
  title: string | null;
  category: string | null;
  date: string | null;
  time: string | null;
  condition: string | null;
}

export function safeParseJSON(jsonString: string): ParsedTodo | null {
  try {
    const parsed = JSON.parse(jsonString);

    return {
      title: parsed.title ?? null,
      category: parsed.category ?? null,
      date: parsed.date ?? null,
      time: parsed.time ?? null,
      condition: parsed.condition ?? null,
    };
  } catch (err) {
    console.error("❌ JSON 파싱 실패:", err);
    return null;
  }
}
