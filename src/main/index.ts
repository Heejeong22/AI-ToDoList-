import { app, BrowserWindow, ipcMain } from 'electron'
import { createWindow } from './windows'
import { registerShortcuts } from './shortcuts'
import { setupTodoHandlers } from './ipc/todoHandlers'
import { setupAiHandlers } from './ipc/aiHandlers'
import { setupAppHandlers } from './ipc/appHandlers'
import * as Drizzle from './db/drizzle'
import { runMigration } from './utils/migrate'
import { setupGptAiHandlers } from './ipc/gptAiHandlers'

// 전역 타입 선언
declare global {
  namespace Electron {
    interface App {
      isQuitting?: boolean
    }
  }
}

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  try {
    // 1) 스키마 기반 자동 마이그레이션 적용
    await runMigration()

    // 2) DB 초기화
    await Drizzle.initializeDatabase()

    // Create the main window
    mainWindow = createWindow()

    // Register global shortcuts
    registerShortcuts(mainWindow)

    // Setup IPC handlers
    setupTodoHandlers(ipcMain)
    setupAiHandlers(ipcMain)
    setupAppHandlers(ipcMain)
    setupGptAiHandlers(ipcMain) 
  } catch (error) {
    console.error('Failed to initialize app:', error)
    app.quit()
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    } else if (mainWindow) {
      // Dock 아이콘 클릭 시 창 표시 (macOS)
      mainWindow.show()
    }
  })
})

// before-quit 이벤트
app.on('before-quit', () => {
  app.isQuitting = true
})

// window-all-closed 이벤트 수정
app.on('window-all-closed', () => {
  // macOS: 창 닫아도 앱은 계속 실행 (Dock에서 숨김)
  // 완전 종료는 Cmd+Q나 메뉴에서만 가능
  if (app.isQuitting) {
    app.quit()
  }
  // Windows/Linux: 창 닫으면 앱 종료 (기본 동작)
  // 나중에 트레이 추가 시 macOS와 동일하게 변경
  else if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // 모든 새 창 생성을 방지합니다.
    // 필요에 따라 특정 URL만 허용할 수 있습니다.
    console.log(`새 창 생성 시도: ${url}`);
    return { action: 'deny' };
  });
});

// Handle app ready to show
app.on('ready', () => {
  console.log('AI TodoList app is ready!')
})
