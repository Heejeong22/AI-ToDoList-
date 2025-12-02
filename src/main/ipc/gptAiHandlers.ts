// src/main/ipc/gpt-ai.ipc.ts

import { IpcMain } from "electron";
import { analyzeTodoText } from "../../../ai/analyzer";

/**
 * GPT 기반 Todo 분석 IPC 핸들러
 * renderer → preload(api.ai.gptAnalyze) → main → analyzer.ts → OpenAI
 */
export function setupGptAiHandlers(ipcMain: IpcMain) {
  ipcMain.handle("gptAI:analyzeTodo", async (_, text: string) => {
    console.log("📩 [IPC] GPT Todo 분석 요청:", text);

    try {
      const result = await analyzeTodoText(text);

      console.log("📤 [IPC] GPT 분석 결과:", result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("❌ GPT Todo 분석 실패:", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown GPT error",
      };
    }
  });
}
