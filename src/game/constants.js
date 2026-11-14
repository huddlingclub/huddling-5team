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
  DURATION_SEC: 120,
};

// 게임 물리 관련
export const GAME = {
  // 시작 전 카운트다운 (초)
  COUNTDOWN_SEC: 3,
  // 카운트다운이 끝난 뒤 GO를 보여주는 시간 (ms)
  GO_SHOW_MS: 700,
  // 공격 알림을 띄우는 시간 (ms)
  NOTICE_MS: 1500,
  // 합체 후 획득 점수를 화면에 보여주는 시간 (ms)
  SCORE_GAIN_SHOW_MS: 900,
  // 장애물이 날아올 때 도둑이 던질 준비 자세로 서 있는 시간 (ms) - 그 뒤 던지는 자세로 바뀐다
  THIEF_WINDUP_MS: 350,
  // 시간이 끝난 뒤 "시간종료!"를 보여주다가 리더보드로 넘어가는 시간 (ms)
  TIME_UP_SHOW_MS: 3000,
  // 합체로 막 생긴 음료가 다시 합쳐지기까지 기다리는 시간 (ms) - 생기자마자 또 합쳐져 안 보이는 것 방지
  MERGE_LOCK_MS: 250,
  // 합체로 생긴 음료가 작게 시작해 제 크기로 커지는 시간 (ms)
  MERGE_POP_MS: 180,
  // 합체로 생긴 음료가 처음 그려지는 크기 비율 (1 = 제 크기)
  MERGE_POP_START_SCALE: 0.6,
  // 경고선 초과 허용 시간 (ms)
  DANGER_TIMEOUT_MS: 2000,
  // 경고선 높이 (컵 위쪽에서 px)
  DANGER_LINE_Y: 48,
  // 점수 전송 주기 제한 (ms)
  SCORE_THROTTLE_MS: 1000,
  // 컵 안 음료 최대 개수
  MAX_DRINKS_IN_CUP: 60,
  // 기본 원두 반지름 (px) - 다른 단계는 size 배수
  BASE_RADIUS: 16,
  // 연속 낙하 사이 최소 간격 (ms)
  DROP_COOLDOWN_MS: 500,
  // 손에 든 음료와 컵 위쪽 사이 간격 (px)
  DROP_TOP_GAP: 4,
  // 컵 벽 두께 (px, 화면 밖에 있어 보이지 않음)
  WALL_THICKNESS: 60,
  // 음료 탄성 (0 = 안 튐, 1 = 그대로 튐)
  RESTITUTION: 0.2,
  // 음료 마찰
  FRICTION: 0.3,
  // 한 프레임에 진행하는 최대 시간 (ms) - 탭을 벗어났다 돌아올 때 튀는 것 방지
  MAX_FRAME_MS: 33,
  // 그림의 긴 변 = 음료 지름 × 이 비율 (1이면 그림 긴 변이 지름과 같음)
  SPRITE_FIT: 1,
  // 이 값보다 불투명한 픽셀만 그림의 몸통으로 본다 (0~255)
  OUTLINE_ALPHA_MIN: 32,
  // 충돌 외곽선을 이루는 꼭짓점 최대 개수 (많을수록 정밀하지만 느려짐)
  OUTLINE_MAX_POINTS: 14,
  // true면 충돌 외곽선을 화면에 그린다 (확인용)
  DEBUG_SHOW_OUTLINE: false,
  // (그림을 못 불러왔을 때) 이 단계부터 원 안에 음료 이름을 적는다
  LABEL_MIN_LEVEL: 3,
  // 음료 이름 글자 크기 (px)
  LABEL_FONT_PX: 12,
};

// 콤보와 공격
export const COMBO = {
  // 콤보가 이어지는 시간 (ms)
  WINDOW_MS: 1500,
  // 공격이 발동하는 최소 콤보
  ATTACK_MIN_COMBO: 2,
  // 한 번에 보내는 최대 장애물 수
  MAX_OBSTACLES_PER_ATTACK: 3,
};

// 방해 요소 (장애물)
const EVENT_DROP_INTERVAL_SEC = 15;
export const OBSTACLE = {
  EVENT_DROP_INTERVAL_SEC,
  // 종료 시각과 겹치는 투하는 제외한다.
  EVENT_DROP_COUNT: Math.ceil(ROOM.DURATION_SEC / EVENT_DROP_INTERVAL_SEC) - 1,
  // 이 거리(px) 안에서 합체가 일어나면 장애물 삭제
  CLEAR_RADIUS_PX: 40,
  // 한 컵에 쌓일 수 있는 장애물 수
  MAX_IN_CUP: 5,
  // 여러 개가 떨어질 때 간격 (ms)
  DROP_GAP_MS: 300,
  // 폭 기준이 되는 음료 단계 (에스프레소와 비슷한 폭)
  WIDTH_LEVEL: 2,
  // 두께 = 폭 × 이 비율
  THICKNESS_RATIO: 0.5,
  // 모서리 둥글기 (px)
  CORNER_RADIUS: 4,
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
