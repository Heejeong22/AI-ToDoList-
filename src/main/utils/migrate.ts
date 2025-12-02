import { exec } from 'child_process'

// 앱 실행 시 마이그레이션을 자동으로 적용하는 함수
export function runMigration(): Promise<void> {
  // 개발/배포 모두에서 프로젝트 루트를 기준으로 실행
  const rootPath = process.cwd()
  // 최신 drizzle-kit CLI를 사용해 SQLite 마이그레이션 적용
  const command = 'npx drizzle-kit@latest push:sqlite'

  console.log('🔄 Checking DB migrations...')

  return new Promise((resolve) => {
    exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Migration error:', error)
        if (stderr) {
          console.error(stderr)
        }
        // 마이그레이션 실패가 앱 전체 실행을 막지 않도록 resolve만 호출
        return resolve()
      }

      console.log('✅ DB migration completed')
      if (stdout) {
        console.log(stdout)
      }
      resolve()
    })
  })
}

