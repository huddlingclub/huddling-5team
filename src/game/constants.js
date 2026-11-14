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

// 자동 닉네임 생성용 단어
const ADJECTIVES = [
  '행복한', '용감한', '졸린', '신난', '배고픈',
  '귀여운', '느긋한', '씩씩한', '수줍은', '엉뚱한',
  '반짝이는', '조용한', '활발한', '따뜻한', '시원한',
];
const ANIMALS = [
  '고양이', '강아지', '펭귄', '토끼', '곰',
  '여우', '판다', '코알라', '수달', '다람쥐',
  '부엉이', '햄스터', '오리', '알파카', '고슴도치',
];

// 랜덤 닉네임 생성 ("행복한 고양이" 스타일)
export function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}
