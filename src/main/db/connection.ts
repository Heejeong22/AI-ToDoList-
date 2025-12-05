// src/main/db/connection.ts

import path from "path";
import fs from "fs";
import { app } from "electron";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// Lazy initialization variables
let _db: ReturnType<typeof drizzle> | null = null;
let _sqlite: Database.Database | null = null;
let _dbPath: string | null = null;

// Initialize database connection (should be called after app.whenReady())
export function initializeDatabaseConnection() {
  if (_db) return; // Already initialized

  // 1. 사용자 홈 디렉토리 경로 가져오기
  const homeDir = app.getPath("home");

  // 2. 앱 전용 폴더 생성: ~/.ai-todo-app/database
  const appDataDir = path.join(homeDir, ".ai-todo-app", "database");

  // 폴더 없으면 자동 생성
  if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
  }

  // 3. SQLite DB 파일 경로 설정
  _dbPath = path.join(appDataDir, "todo.db");

  // 4. DB 연결 (파일 없으면 자동 생성)
  _sqlite = new Database(_dbPath);

  // 5. Drizzle ORM 인스턴스 생성
  _db = drizzle(_sqlite);

  // 확인용 콘솔 출력
  console.log("[DB Ready] SQLite 경로:", _dbPath);
}

// Getters for lazy-initialized values
export function getDb() {
  if (!_db) {
    throw new Error("Database not initialized. Call initializeDatabaseConnection() first.");
  }
  return _db;
}

export function getSqlite() {
  if (!_sqlite) {
    throw new Error("Database not initialized. Call initializeDatabaseConnection() first.");
  }
  return _sqlite;
}

export function getDbPath() {
  if (!_dbPath) {
    throw new Error("Database not initialized. Call initializeDatabaseConnection() first.");
  }
  return _dbPath;
}

// Backward compatibility exports
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});

export const sqlite = new Proxy({} as Database.Database, {
  get(_target, prop) {
    return getSqlite()[prop as keyof Database.Database];
  }
});

export let dbPath: string;

// Update dbPath after initialization
export function updateDbPath() {
  dbPath = getDbPath();
}