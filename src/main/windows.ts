import { BrowserWindow, app } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createWindow(): BrowserWindow {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 360,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
    titleBarStyle: 'default',
    title: 'AI TodoList',
    icon: path.join(__dirname, '../../assets/icon.png'), // 아이콘 파일이 있으면
    show: false, // 처음에 숨김
  })

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // OS별 창 관리 로직
  // 트레이가 있으므로 X 버튼 클릭 시 hide (양쪽 플랫폼 모두)
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()

      // macOS: Dock 아이콘도 숨김
      if (process.platform === 'darwin' && app.dock) {
        app.dock.hide()
      }
    }
    // app.isQuitting이 true면 정상 종료
  })

  // macOS Dock 관리
  mainWindow.on('show', () => {
    if (process.platform === 'darwin' && app.dock) {
      app.dock.show()
    }
  })

  return mainWindow
}

export function createSettingsWindow(parentWindow: BrowserWindow): BrowserWindow {
  const settingsWindow = new BrowserWindow({
    width: 600,
    height: 400,
    parent: parentWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
    title: '설정',
    resizable: false,
  })

  // 설정 페이지를 로드 (나중에 구현)
  settingsWindow.loadURL('http://localhost:5173/settings')

  return settingsWindow
}
