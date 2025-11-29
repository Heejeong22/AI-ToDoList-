// src/main/db/connection.ts

import path from "path";
import fs from "fs";
import { app } from "electron";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// 1. 사용자 홈 디렉토리 경로 가져오기
const homeDir = app.getPath("home");

// 2. 앱 전용 폴더 생성: ~/.ai-todo-app/database
const appDataDir = path.join(homeDir, ".ai-todo-app", "database");

// 폴더 없으면 자동 생성
if (!fs.existsSync(appDataDir)) {
  fs.mkdirSync(appDataDir, { recursive: true });
}

// 3. SQLite DB 파일 경로 설정
export const dbPath = path.join(appDataDir, "todo.db");

// 4. DB 연결 (파일 없으면 자동 생성)
// drizzle 설정 및 외부에서 커넥션 종료를 할 수 있도록 export
export const sqlite = new Database(dbPath);

// 5. Drizzle ORM 인스턴스 생성
export const db = drizzle(sqlite);

// 확인용 콘솔 출력
console.log("[DB Ready] SQLite 경로:", dbPath);