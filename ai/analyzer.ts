// analyzer.ts

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

import { safeParseJSON } from "./parser";
import { createSystemPrompt } from "./prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 현재 시간
function getCurrentContext() {
  const now = new Date();
  return {
    todayDate: now.toISOString().slice(0, 10), // YYYY-MM-DD
    nowTime: now.toTimeString().slice(0, 5),   // HH:MM
  };
}

// 🎯 AI 분석 함수 (실제 호출)
export async function analyzeTodoText(input: string) {
  const { todayDate, nowTime } = getCurrentContext();
  const systemPrompt = createSystemPrompt(todayDate, nowTime);

  try {
    const res = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: input,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = res.choices[0].message.content;

    if (!content) {
      console.error("❌ AI 응답이 null입니다.");
      return null;
    }

    return safeParseJSON(content);
  } catch (err) {
    console.error("❌ OpenAI 호출 실패:", err);
    return null;
  }
}
