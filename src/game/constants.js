// 게임 숫자 상수 (음료 단계, 점수, 크기, 확률, 시간 등)

// 음료 머지 단계
export const DRINKS = [
  { level: 1, name: '원두',           color: 'bean',     dropRate: 0.5,  mergeScore: 0,   size: 1.0 },
  { level: 2, name: '에스프레소',      color: 'espresso', dropRate: 0.3,  mergeScore: 2,   size: 1.4 },
  { level: 3, name: '아이스 아메리카노', color: 'americano', dropRate: 0.2, mergeScore: 5,   size: 1.9 },
  { level: 4, name: '라떼',           color: 'latte',    dropRate: 0,    mergeScore: 12,  size: 2.5 },
  { level: 5, name: '커피 프라페',     color: 'frappe',   dropRate: 0,    mergeScore: 30,  size: 3.2 },
  { level: 6, name: '유니콘 프라페',   color: 'unicorn',  dropRate: 0,    mergeScore: 80,  size: 4.0 },
];

// 유니콘 + 유니콘 보너스 점수
export const UNICORN_BONUS = 200;

// 방 설정 범위
export const ROOM = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 5,
  DEFAULT_PLAYERS: 4,
  MIN_DURATION_SEC: 30,
  MAX_DURATION_SEC: 300,
  DEFAULT_DURATION_SEC: 120,
  DURATION_STEP_SEC: 30,
};

// 게임 물리 관련
export const GAME = {
  // 경고선 초과 허용 시간 (ms)
  DANGER_TIMEOUT_MS: 2000,
  // 점수 전송 주기 제한 (ms)
  SCORE_THROTTLE_MS: 1000,
  // 컵 안 음료 최대 개수
  MAX_DRINKS_IN_CUP: 60,
  // 기본 원두 반지름 (px) - 다른 단계는 size 배수
  BASE_RADIUS: 16,
};

// 방 코드 생성용 문자 (0, O, 1, I, L 제외)
export const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 6;
