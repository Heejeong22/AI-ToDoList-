import { BrowserWindow, globalShortcut } from 'electron'

export function registerShortcuts(mainWindow: BrowserWindow): void {
  // Ctrl+Alt+H: 창 숨기기/보이기 토글
  globalShortcut.register('CommandOrControl+Alt+H', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll()
}
