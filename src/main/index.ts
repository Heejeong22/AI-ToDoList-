import { app, BrowserWindow, ipcMain } from 'electron'
import { createWindow } from './windows'
import { registerShortcuts } from './shortcuts'
import { setupTodoHandlers } from './ipc/todoHandlers'
import { setupAiHandlers } from './ipc/aiHandlers'
import { setupAppHandlers } from './ipc/appHandlers'
import * as Drizzle from './db/drizzle'
import { runMigration } from './utils/migrate'


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
  } catch (error) {
    console.error('Failed to initialize app:', error)
    app.quit()
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
