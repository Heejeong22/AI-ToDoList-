import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'

// Electron 메인 프로세스 전용 설정
export default defineConfig({
  plugins: [
    electron({
      main: {
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: ['better-sqlite3'],
            },
          },
        },
      },
      preload: {
        input: 'src/preload/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron/preload',
          },
        },
      },
    }),
  ],
})
