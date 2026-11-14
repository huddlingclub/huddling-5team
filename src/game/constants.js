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
  // 이 단계부터 원 안에 음료 이름을 적는다
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
export const OBSTACLE = {
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
