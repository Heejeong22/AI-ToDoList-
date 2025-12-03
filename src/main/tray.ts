import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let tray: Tray | null = null

export function createTray(mainWindow: BrowserWindow): Tray {
    // 트레이 아이콘 경로 설정
    const iconPath = process.platform === 'darwin'
        ? path.join(__dirname, '../../assets/icons/iconTemplate.png')
        : path.join(__dirname, '../../assets/icons/icon.png')

    // 트레이 아이콘 생성
    const icon = nativeImage.createFromPath(iconPath)

    // macOS의 경우 Template 이미지로 설정 (다크/라이트 모드 자동 적응)
    if (process.platform === 'darwin') {
        icon.setTemplateImage(true)
    }

    tray = new Tray(icon)

    // 툴팁 설정
    tray.setToolTip('AI TodoList')

    // 컨텍스트 메뉴 생성
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '열기',
            click: () => {
                mainWindow.show()
                if (process.platform === 'darwin' && app.dock) {
                    app.dock.show()
                }
            },
        },
        { type: 'separator' },
        {
            label: '새 할 일 추가',
            accelerator: 'CommandOrControl+Shift+T',
            click: () => {
                mainWindow.show()
                mainWindow.webContents.send('shortcut:new-todo')
            },
        },
        {
            label: '빠른 추가',
            accelerator: 'CommandOrControl+Shift+Q',
            click: () => {
                mainWindow.show()
                mainWindow.webContents.send('shortcut:quick-add')
            },
        },
        {
            label: 'AI 분석',
            accelerator: 'CommandOrControl+Shift+A',
            click: () => {
                mainWindow.show()
                mainWindow.webContents.send('shortcut:ai-analysis')
            },
        },
        {
            label: '검색',
            accelerator: 'CommandOrControl+Shift+S',
            click: () => {
                mainWindow.show()
                mainWindow.webContents.send('shortcut:search')
            },
        },
        { type: 'separator' },
        {
            label: '설정',
            click: () => {
                mainWindow.show()
                mainWindow.webContents.send('shortcut:settings')
            },
        },
        { type: 'separator' },
        {
            label: '종료',
            click: () => {
                app.isQuitting = true
                app.quit()
            },
        },
    ])

    // 트레이 메뉴 설정
    tray.setContextMenu(contextMenu)

    // macOS: 트레이 아이콘 클릭 시 창 토글
    // Windows/Linux: 왼쪽 클릭 시 메뉴 표시 (기본 동작)
    if (process.platform === 'darwin') {
        tray.on('click', () => {
            if (mainWindow.isVisible()) {
                mainWindow.hide()
                if (app.dock) {
                    app.dock.hide()
                }
            } else {
                mainWindow.show()
                if (app.dock) {
                    app.dock.show()
                }
            }
        })
    } else {
        // Windows/Linux: 왼쪽 클릭 시 창 토글
        tray.on('click', () => {
            if (mainWindow.isVisible()) {
                mainWindow.hide()
            } else {
                mainWindow.show()
            }
        })
    }

    return tray
}

export function getTray(): Tray | null {
    return tray
}

export function destroyTray(): void {
    if (tray) {
        tray.destroy()
        tray = null
    }
}
