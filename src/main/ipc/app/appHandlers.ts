import { IpcMain, app, dialog } from 'electron'
import os from 'os'

export function setupAppHandlers(ipcMain: IpcMain): void {
  // 앱 버전 정보 가져오기
  ipcMain.handle('app:getVersion', () => {
    return {
      success: true,
      data: {
        version: app.getVersion(),
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome,
        platform: process.platform,
        arch: process.arch,
      },
    }
  })

  // 앱 데이터 폴더 경로 가져오기
  ipcMain.handle('app:getAppDataPath', () => {
    return {
      success: true,
      data: app.getPath('userData'),
    }
  })

  // 시스템 정보 가져오기
  ipcMain.handle('app:getSystemInfo', () => {
    return {
      success: true,
      data: {
        platform: process.platform,
        arch: process.arch,
        version: os.version(),
        release: os.release(),
        hostname: os.hostname(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
      },
    }
  })

  // 파일 선택 다이얼로그
  ipcMain.handle('app:selectFile', async (_event, options = {}) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: options.filters || [{ name: '모든 파일', extensions: ['*'] }],
        ...options,
      })

      return {
        success: true,
        data: {
          canceled: result.canceled,
          filePaths: result.filePaths,
          filePath: result.filePaths[0],
        },
      }
    } catch (error) {
      console.error('Error opening file dialog:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 폴더 선택 다이얼로그
  ipcMain.handle('app:selectFolder', async (_event, options = {}) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        ...options,
      })

      return {
        success: true,
        data: {
          canceled: result.canceled,
          filePaths: result.filePaths,
          folderPath: result.filePaths[0],
        },
      }
    } catch (error) {
      console.error('Error opening folder dialog:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 파일 저장 다이얼로그
  ipcMain.handle('app:saveFile', async (_event, options = {}) => {
    try {
      const result = await dialog.showSaveDialog({
        filters: options.filters || [{ name: '모든 파일', extensions: ['*'] }],
        ...options,
      })

      return {
        success: true,
        data: {
          canceled: result.canceled,
          filePath: result.filePath,
        },
      }
    } catch (error) {
      console.error('Error opening save dialog:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })

  // 앱 다시 시작
  ipcMain.handle('app:restart', () => {
    app.relaunch()
    app.exit(0)
  })

  // 앱 종료
  ipcMain.handle('app:quit', () => {
    app.quit()
  })
}



