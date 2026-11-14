# Encantado - 커피내기 머지 게임

직장인 2~5명이 방 코드 하나로 모여, 커피 테마 머지 퍼즐을 동시에 플레이하고 **최저 점수자가 커피를 사는** 웹 게임입니다.

## 어떤 서비스인가요?

점심 후 티타임, "오늘 커피 누가 쏘지?"를 게임으로 정합니다.

- 설치, 회원가입 없이 **링크 하나로 1분 안에 시작**
- 각자 폰에서 **커피 음료 머지 퍼즐**을 플레이하고, 점수만 실시간 공유
- 제한 시간이 끝나면 **가장 점수가 낮은 사람이 커피 담당**
- 한 판 끝나면 방이 사라지는 일회성 세션 (계정, 데이터 저장 없음)

## 게임 방식

같은 음료 두 잔이 닿으면 다음 단계 음료로 합쳐지고 점수를 얻습니다.

| 단계 | 음료 | 합쳐질 때 점수 |
|------|------|---------------|
| 1 | 원두 | - |
| 2 | 에스프레소 | +2 |
| 3 | 아이스 아메리카노 | +5 |
| 4 | 라떼 | +12 |
| 5 | 커피 프라페 | +30 |
| 6 | 유니콘 프라페 | +80 |

- 컵 상단 경고선을 2초 이상 넘으면 게임오버
- 제한 시간 종료 또는 전원 게임오버 시 결과 발표

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React + Vite |
| 스타일 | Tailwind CSS v4 + shadcn/ui |
| 게임 물리 | matter.js |
| 실시간 통신 | Supabase Realtime (Broadcast + Presence) |
| 배포 | Vercel |

## 시작하기

```bash
# 저장소 클론
git clone https://github.com/huddlingclub/huddling-5team.git
cd huddling-5team

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 Supabase URL과 anon key 입력

# 개발 서버 실행
npm run dev
```

## 프로젝트 구조

```
src/
├── screens/          # 화면 (Home, Lobby, Play, Result)
├── components/       # 공용 UI 컴포넌트
│   └── ui/           # shadcn/ui 컴포넌트
├── game/             # 게임 로직 (engine, constants)
├── room/             # 실시간 통신 (Supabase, protocol)
├── strings.js        # 화면 문구
└── App.jsx           # 화면 전환, 모듈 연결
```

## 팀 규칙

자세한 개발 규칙은 [AGENTS.md](./AGENTS.md), 기획 상세는 [PRD](./docs/PRD.md)를 참고하세요.
