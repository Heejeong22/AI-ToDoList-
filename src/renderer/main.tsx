import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// 전역 API 타입 선언
declare global {
  interface Window {
    api: {
      todo: any
      ai: any
      app: any
      on: (channel: string, callback: (...args: any[]) => void) => void
      removeListener: (channel: string, callback: (...args: any[]) => void) => void
      invoke: (channel: string, data?: any) => Promise<any>
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
