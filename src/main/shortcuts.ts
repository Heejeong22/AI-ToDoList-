import { BrowserWindow, globalShortcut } from 'electron'

export function registerShortcuts(mainWindow: BrowserWindow): void {
  // Ctrl+Shift+T: 새 Todo 추가 창 열기
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    mainWindow.webContents.send('shortcut:new-todo')
  })

  // Ctrl+Shift+A: AI 분석 창 열기
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    mainWindow.webContents.send('shortcut:ai-analysis')
  })

  // Ctrl+Shift+S: 검색 창 열기
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    mainWindow.webContents.send('shortcut:search')
  })

  // Ctrl+Shift+Q: 빠른 Todo 추가
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    mainWindow.webContents.send('shortcut:quick-add')
  })

  // Ctrl+Alt+H: 창 숨기기/보이기 토글
  globalShortcut.register('CommandOrControl+Alt+H', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  // F12: 개발자 도구 토글 (개발 모드에서만)
  if (process.env.NODE_ENV === 'development') {
    globalShortcut.register('F12', () => {
      mainWindow.webContents.toggleDevTools()
    })
  }

  // ESC: 현재 포커스된 요소 해제
  globalShortcut.register('Escape', () => {
    mainWindow.webContents.send('shortcut:escape')
  })
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll()
}
