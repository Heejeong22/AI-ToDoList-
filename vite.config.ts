import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/index.ts',
      },
      {
        entry: 'src/preload/preload.ts',
        onstart({ reload }) {
          reload()
        },
      },
    ]),
    renderer(),
  ],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
