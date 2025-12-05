import { contextBridge, ipcRenderer } from 'electron'
import type { CreateTodoInput } from 'src/main/ipc/todo/createTodoHandlers';


// Type definitions for the exposed API
interface Todo {
  id?: number
  title: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  tags?: string[]
  dueDate?: Date
  aiSuggestions?: any
  estimatedTime?: number
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Preload scripts context bridge API
const api = {
  // Todo 관련 API
  todo: {
    getAll: (): Promise<ApiResponse<Todo[]>> =>
      ipcRenderer.invoke('todo:getAll'),

    create: (todo: CreateTodoInput): Promise<ApiResponse<any>> =>
      ipcRenderer.invoke('todo:create', todo),

    update: (id: number, updates: Partial<Todo>): Promise<ApiResponse<Todo>> =>
      ipcRenderer.invoke('todo:update', { id, updates }),

    delete: (id: number): Promise<ApiResponse> =>
      ipcRenderer.invoke('todo:delete', id),

    toggleComplete: (id: number): Promise<ApiResponse<Todo>> =>
      ipcRenderer.invoke('todo:toggleComplete', id),

    search: (query: string): Promise<ApiResponse<Todo[]>> =>
      ipcRenderer.invoke('todo:search', query),

    getByCategory: (category: string): Promise<ApiResponse<Todo[]>> =>
      ipcRenderer.invoke('todo:getByCategory', category),

    getByPriority: (priority: 'low' | 'medium' | 'high'): Promise<ApiResponse<Todo[]>> =>
      ipcRenderer.invoke('todo:getByPriority', priority),
  },

  // AI 분석 관련 API
  ai: {
    analyzePriority: (title: string, description?: string): Promise<ApiResponse> =>
      ipcRenderer.invoke('ai:analyzePriority', { title, description }),

    analyzeCategory: (title: string, description?: string): Promise<ApiResponse> =>
      ipcRenderer.invoke('ai:analyzeCategory', { title, description }),

    estimateTime: (title: string, description?: string): Promise<ApiResponse> =>
      ipcRenderer.invoke('ai:estimateTime', { title, description }),

    analyzeComprehensive: (title: string, description?: string): Promise<ApiResponse> =>
      ipcRenderer.invoke('ai:analyzeComprehensive', { title, description }),

    saveAnalysis: (todoId: number, analysisType: string, result: any, confidence: number): Promise<ApiResponse> =>
      ipcRenderer.invoke('ai:saveAnalysis', { todoId, analysisType, result, confidence }),

    getAnalysisHistory: (todoId: number): Promise<ApiResponse> =>
      ipcRenderer.invoke('ai:getAnalysisHistory', todoId),

    gptAnalyzeTodo: (text: string): Promise<ApiResponse> =>
      ipcRenderer.invoke('gptAI:analyzeTodo', text),
  },

  // 앱 관련 API
  app: {
    getVersion: (): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:getVersion'),

    getSettings: (): Promise<ApiResponse<Record<string, string>>> =>
      ipcRenderer.invoke('app:getSettings'),

    setSetting: (key: string, value: any): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:setSetting', { key, value }),

    setSettings: (settings: Record<string, any>): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:setSettings', settings),

    getAppDataPath: (): Promise<ApiResponse<string>> =>
      ipcRenderer.invoke('app:getAppDataPath'),

    getSystemInfo: (): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:getSystemInfo'),

    selectFile: (options?: any): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:selectFile', options),

    selectFolder: (options?: any): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:selectFolder', options),

    saveFile: (options?: any): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:saveFile', options),

    saveStatistics: (statsData: any): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:saveStatistics', statsData),

    getStatistics: (dateRange?: { startDate?: Date, endDate?: Date }): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:getStatistics', dateRange),

    restart: (): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:restart'),

    quit: (): Promise<ApiResponse> =>
      ipcRenderer.invoke('app:quit'),
  },

  // 알림 관련 API
  notification: {
    test: (message?: string): Promise<ApiResponse> =>
      ipcRenderer.invoke('notification:test', message),

    checkNow: (): Promise<ApiResponse> =>
      ipcRenderer.invoke('notification:checkNow'),

    resetNotified: (todoId: number): Promise<ApiResponse> =>
      ipcRenderer.invoke('notification:resetNotified', todoId),
  },

  // 이벤트 리스너
  on: (channel: string, callback: (...args: any[]) => void) => {
    // 허용된 채널만 리스닝 가능
    const allowedChannels = [
      'shortcut:new-todo',
      'shortcut:ai-analysis',
      'shortcut:search',
      'shortcut:quick-add',
      'shortcut:escape',
      'notification:clicked',
      'notification:log'
    ]

    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args))
    }
  },

  // 이벤트 리스너 제거
  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback)
  },

  // 단축키 이벤트 리스너 (cleanup 함수 반환)
  onShortcut: (channel: string, callback: () => void) => {
    const subscription = (_event: any) => callback()

    // 허용된 채널만 리스닝
    const allowedChannels = [
      'new-todo',
      'ai-analysis',
      'search',
      'quick-add',
      'escape'
    ]

    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(`shortcut:${channel}`, subscription)
    }

    // Cleanup 함수 반환
    return () => {
      ipcRenderer.removeListener(`shortcut:${channel}`, subscription)
    }
  },

  // 일반적인 invoke (다른 API에서 처리되지 않은 경우)
  invoke: (channel: string, data?: any): Promise<any> => {
    return ipcRenderer.invoke(channel, data)
  }
}

// Context Bridge를 통해 안전하게 API 노출
contextBridge.exposeInMainWorld('api', api)

// TypeScript 타입 정의를 위해 window 객체 확장
declare global {
  interface Window {
    api: typeof api
  }
}
