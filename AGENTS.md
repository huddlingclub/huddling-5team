# 커피내기 머지 게임 - 팀 규칙

- 스택: React(함수형 + Hooks, JavaScript/JSX) + Tailwind CSS v4 + shadcn/ui + Vite. TypeScript, 다른 UI 라이브러리 금지
- 패키지: npm만 사용. 새 패키지 설치 금지 (필요하면 먼저 알려준다)
- 스타일: Tailwind 클래스만. 색·글꼴·둥글기는 src/index.css의 @theme 토큰만 쓰고 임의 값(bg-[#...]) 금지
- 버튼·카드·모달·다이얼로그는 src/components/ui/ (shadcn/ui)와 src/components/ 것을 재사용한다
- 화면 문구는 src/strings.js, 게임 숫자는 src/game/constants.js에만 둔다
- 메시지 이름·필드는 src/room/protocol.js를 따른다. 임의로 추가·변경 금지
- engine.js는 React를 import하지 않는다. screens/는 Supabase를 직접 부르지 않는다
- 요청받은 담당 파일만 수정한다. 다른 파일 수정이 필요하면 먼저 알려준다
- 커밋 전 npm run build를 통과시킨다. main에 직접 커밋하지 않는다
- secret 키를 넣지 않는다. 환경 변수는 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY만
