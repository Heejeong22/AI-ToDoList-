import { app, BrowserWindow, ipcMain } from 'electron'
import { createWindow } from './windows'
import { registerShortcuts } from './shortcuts'
import { createTray } from './tray'
import { setupTodoHandlers } from './ipc/todo/todoHandlers'
import { setupAiHandlers } from './ipc/ai/aiHandlers'
import { setupAppHandlers } from './ipc/app/appHandlers'
import * as Drizzle from './db/drizzle'
import { runMigration } from './utils/migrate'
import { setupGptAiHandlers } from './ipc/gpt/gptAiHandlers'
import { setupNotificationHandlers } from './ipc/notification/notificationHandlers'
import {
  initializeNotificationScheduler,
  stopNotificationScheduler,
} from './notification/notificationScheduler'
import { addNotificationFields } from './db/addNotificationFields'

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

    // 3) 알림 필드 추가 마이그레이션
    await addNotificationFields()

    // Create the main window
    mainWindow = createWindow()

    // Create system tray
    createTray(mainWindow)

    // Register global shortcuts
    registerShortcuts(mainWindow)

    // Setup IPC handlers
    setupTodoHandlers(ipcMain)
    setupAiHandlers(ipcMain)
    setupAppHandlers(ipcMain)
    setupGptAiHandlers(ipcMain)
    setupNotificationHandlers(ipcMain)

    // 알림 스케줄러 시작
    initializeNotificationScheduler(mainWindow)
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
  stopNotificationScheduler()
})

// window-all-closed 이벤트 수정
app.on('window-all-closed', () => {
  // 트레이가 있으므로 창이 모두 닫혀도 앱은 계속 실행
  // macOS, Windows, Linux 모두 트레이에서 실행 유지
  // 완전 종료는 트레이 메뉴에서 "종료" 선택 시에만
  if (app.isQuitting) {
    app.quit()
  }
  // 트레이가 있으므로 창 없이도 백그라운드에서 실행
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
