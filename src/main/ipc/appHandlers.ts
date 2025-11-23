import { IpcMain, app, dialog } from 'electron'
import { db } from '../db/drizzle'
import { userSettings, statistics } from '../db/schema'
import { sql } from 'drizzle-orm'
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
      }
    }
  })

  // 사용자 설정 가져오기
  ipcMain.handle('app:getSettings', async () => {
    try {
      const settings = await db.select().from(userSettings)
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, string>)

      return { success: true, data: settingsMap }
    } catch (error) {
      console.error('Error fetching settings:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 사용자 설정 저장
  ipcMain.handle('app:setSetting', async (_, { key, value }) => {
    try {
      await db
        .insert(userSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: userSettings.key,
          set: { value, updatedAt: new Date() }
        })

      return { success: true }
    } catch (error) {
      console.error('Error saving setting:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 여러 설정 일괄 저장
  ipcMain.handle('app:setSettings', async (_, settings) => {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
        updatedAt: new Date()
      }))

      for (const update of updates) {
        await db
          .insert(userSettings)
          .values(update)
          .onConflictDoUpdate({
            target: userSettings.key,
            set: { value: update.value, updatedAt: update.updatedAt }
          })
      }

      return { success: true }
    } catch (error) {
      console.error('Error saving settings:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 앱 데이터 폴더 경로 가져오기
  ipcMain.handle('app:getAppDataPath', () => {
    return {
      success: true,
      data: app.getPath('userData')
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
      }
    }
  })

  // 파일 선택 다이얼로그
  ipcMain.handle('app:selectFile', async (_, options = {}) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: options.filters || [
          { name: '모든 파일', extensions: ['*'] }
        ],
        ...options
      })

      return {
        success: true,
        data: {
          canceled: result.canceled,
          filePaths: result.filePaths,
          filePath: result.filePaths[0]
        }
      }
    } catch (error) {
      console.error('Error opening file dialog:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 폴더 선택 다이얼로그
  ipcMain.handle('app:selectFolder', async (_, options = {}) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        ...options
      })

      return {
        success: true,
        data: {
          canceled: result.canceled,
          filePaths: result.filePaths,
          folderPath: result.filePaths[0]
        }
      }
    } catch (error) {
      console.error('Error opening folder dialog:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 파일 저장 다이얼로그
  ipcMain.handle('app:saveFile', async (_, options = {}) => {
    try {
      const result = await dialog.showSaveDialog({
        filters: options.filters || [
          { name: '모든 파일', extensions: ['*'] }
        ],
        ...options
      })

      return {
        success: true,
        data: {
          canceled: result.canceled,
          filePath: result.filePath
        }
      }
    } catch (error) {
      console.error('Error opening save dialog:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 앱 다시 시작
  ipcMain.handle('app:restart', () => {
    app.relaunch()
    app.exit(0)
  })

  // 통계 데이터 저장
  ipcMain.handle('app:saveStatistics', async (_, statsData) => {
    try {
      const result = await db
        .insert(statistics)
        .values(statsData)
        .returning()

      return { success: true, data: result[0] }
    } catch (error) {
      console.error('Error saving statistics:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 통계 데이터 가져오기
  ipcMain.handle('app:getStatistics', async (_, { startDate, endDate }) => {
    try {
      let query = db.select().from(statistics)

      if (startDate) {
        query = query.where(sql`${statistics.date} >= ${startDate}`)
      }

      if (endDate) {
        query = query.where(sql`${statistics.date} <= ${endDate}`)
      }

      const result = await query.orderBy(statistics.date)

      return { success: true, data: result }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  })

  // 앱 종료
  ipcMain.handle('app:quit', () => {
    app.quit()
  })
}
