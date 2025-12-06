import { BrowserWindow, globalShortcut } from 'electron'

export function registerShortcuts(mainWindow: BrowserWindow): void {
  // Ctrl+Shift+T (Mac: Cmd+Shift+T): TODO 앱 열기/닫기 토글
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll()
}
