# 🤖 AI TodoList 데스크톱 앱

AI 기반의 스마트한 TodoList 데스크톱 애플리케이션입니다.

## ✨ 주요 기능

- **할일 관리**: CRUD 작업, 우선순위 설정, 카테고리 분류
- **AI 분석**: 할일 우선순위 자동 분석 및 추천
- **데스크톱 앱**: Electron 기반 크로스 플랫폼 지원
- **실시간 동기화**: 데이터베이스 기반 데이터 관리

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Electron (메인/렌더러 프로세스 분리)
- **Database**: SQLite + Drizzle ORM
- **AI**: 통합 준비 (OpenAI API 등)
- **빌드**: Electron Builder

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+ (권장: 20.x)
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 실행 (Vite + Electron 동시 실행)
npm run dev

# React 앱만 개발
npm run dev:vite

# Electron만 실행
npm run electron

# 빌드
npm run build

# 데이터베이스 마이그레이션
npm run db:generate
npm run db:push
```

## 📁 프로젝트 구조

```
AI_ToDoList/
├── src/
│   ├── main/          # Electron 메인 프로세스
│   │   ├── db/        # 데이터베이스 설정
│   │   ├── ipc/       # IPC 핸들러
│   │   └── *.ts       # 메인 프로세스 파일들
│   ├── preload/       # 프리로드 스크립트
│   └── renderer/      # React UI
│       ├── components/# 컴포넌트들
│       ├── styles/    # CSS 파일들
│       └── *.tsx      # React 파일들
├── dist/              # React 빌드 결과물
├── dist-electron/     # Electron 빌드 결과물
└── drizzle/           # DB 마이그레이션
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 팀

- **개발자**: HeeJung
- **프로젝트**: AI TodoList 데스크톱 앱

---

⭐ Star를 눌러주세요! 도움이 필요하시면 Issues를 통해 문의해주세요.</content>
</xai:function_call">README.md
