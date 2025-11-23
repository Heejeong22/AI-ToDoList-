import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { createWindow } from './windows.js'
import { registerShortcuts } from './shortcuts.js'
import { setupTodoHandlers } from './ipc/todoHandlers.js'
import { setupAiHandlers } from './ipc/aiHandlers.js'
import { setupAppHandlers } from './ipc/appHandlers.js'
import { initializeDatabase } from './db/drizzle.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  try {
    // Initialize database
    await initializeDatabase()

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
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
  })
})

// Handle app ready to show
app.on('ready', () => {
  console.log('AI TodoList app is ready!')
})
