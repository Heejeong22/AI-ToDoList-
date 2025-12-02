/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 브라운 톤
        'bg': {
          'primary': '#E8DCC8',      // 양피지 메인 배경 (더 진함)
          'secondary': '#D4C4A8',    // 양피지 보조 배경
          'card': '#F5EFE0',         // 카드 배경 (조금 밝게)
          'hover': '#DDD0BA',        // 호버 배경
        },
        // 검정 계열 텍스트
        'text': {
          'primary': '#1A1410',      // 진한 검정
          'secondary': '#4A3F35',    // 중간 검정-브라운
        },
        // 진한 브라운 계열
        'accent': '#5D4E3E',         // 액센트 (더 진함)
        'border': '#9B8B7E',         // 테두리 (더 진함)
        'input-border': '#8B7A6A',   // 입력창 테두리 (더 진함)
      },
    },
  },
  plugins: [],
}