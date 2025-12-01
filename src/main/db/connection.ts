// src/main/db/connection.ts

import path from "path";
import fs from "fs";
import { app } from "electron";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

// DB 인스턴스들을 저장할 변수
let sqlite: Database.Database | null = null;
let db: BetterSQLite3Database | null = null;
let dbPath: string | null = null;

// DB 초기화 함수 (app.whenReady() 이후에 호출해야 함)
export function initializeConnection(): void {
  if (sqlite !== null) {
    // 이미 초기화됨
    return;
  }

  // 1. 사용자 홈 디렉토리 경로 가져오기
  const homeDir = app.getPath("home");

  // 2. 앱 전용 폴더 생성: ~/.ai-todo-app/database
  const appDataDir = path.join(homeDir, ".ai-todo-app", "database");

  // 폴더 없으면 자동 생성
  if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
  }

  // 3. SQLite DB 파일 경로 설정
  dbPath = path.join(appDataDir, "todo.db");

  // 4. DB 연결 (파일 없으면 자동 생성)
  sqlite = new Database(dbPath);

  // 5. Drizzle ORM 인스턴스 생성
  db = drizzle(sqlite);

  // 확인용 콘솔 출력
  console.log("[DB Ready] SQLite 경로:", dbPath);
}

// Getter 함수들
export function getDb(): BetterSQLite3Database {
  if (db === null) {
    throw new Error("Database not initialized. Call initializeConnection() first.");
  }
  return db;
}

export function getSqlite(): Database.Database {
  if (sqlite === null) {
    throw new Error("Database not initialized. Call initializeConnection() first.");
  }
  return sqlite;
}

export function getDbPath(): string {
  if (dbPath === null) {
    throw new Error("Database not initialized. Call initializeConnection() first.");
  }
  return dbPath;
}

// 하위 호환성을 위한 export (사용 시 주의)
export { db, sqlite, dbPath };