// analyzer.ts

import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { app } from "electron";

// 프로덕션 빌드에서도 .env 파일을 찾을 수 있도록 경로 설정
if (app.isPackaged) {
  // 프로덕션 빌드: resources 폴더에서 .env 찾기
  const envPath = path.join(process.resourcesPath, '.env');
  console.log('🔍 Loading .env from:', envPath);
  dotenv.config({ path: envPath });
} else {
  // 개발 모드: 프로젝트 루트에서 .env 찾기
  dotenv.config();
}

import { safeParseJSON } from "../src/main/parser";
import { createSystemPrompt } from "./prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 현재 시간
function getCurrentContext() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return {
    todayDate: `${year}-${month}-${day}`, // Local Time YYYY-MM-DD
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
