// 화면에 표시되는 모든 문구를 모아둔 파일
export const STRINGS = {
  // 화면 모드
  THEME_LABEL: '화면 모드',
  THEME_LIGHT: '라이트',
  THEME_DARK: '다크',
  THEME_SYSTEM: '자동',
  THEME_SYSTEM_HINT: '자동은 기기의 화면 설정을 따라요',

  // 홈 화면
  HOME_TITLE: '카페 오이시',
  HOME_START: '시작하기',
  HOME_BACK: '메인으로',
  HOME_NICKNAME: '닉네임',
  HOME_ROOM_CODE: '방 코드',
  HOME_SUBTITLE: '지면 커피 사는 머지 게임',
  NICKNAME_PLACEHOLDER: '닉네임을 입력하세요',
  CREATE_ROOM: '방 만들기',
  JOIN_ROOM: '코드로 입장',
  ROOM_CODE_PLACEHOLDER: '방 코드 6자리',

  // 방 만들기
  SETTING_PLAYERS: '인원수',
  SETTING_DURATION: '제한 시간',
  SETTING_UNIT_PLAYERS: '명',
  SETTING_UNIT_SECONDS: '초',
  SETTING_UNIT_MINUTES: '분',

  // 대기실
  LOBBY_TITLE: '대기실',
  LOBBY_CODE_LABEL: '방 코드',
  LOBBY_COPY: '복사',
  LOBBY_COPIED: '복사됨!',
  LOBBY_START: '게임 시작',
  LOBBY_WAITING: '호스트가 시작할 때까지 대기 중...',
  LOBBY_NEED_MORE: '2명 이상이면 시작할 수 있어요',

  // 입장 오류
  ERROR_NO_ROOM: '없는 코드예요',
  ERROR_ROOM_FULL: '방이 꽉 찼어요',
  ERROR_ALREADY_STARTED: '이미 시작된 방이에요',

  // 플레이
  PLAY_COUNTDOWN_GO: 'GO!',
  PLAY_TIME_LEFT: '남은 시간',
  PLAY_GAME_OVER: '게임오버',
  PLAY_SPECTATING: '관전 중...',
  PLAY_SPECTATING_HINT: '남은 시간 동안 점수판을 지켜보세요',
  PLAY_MY_SCORE: '내 점수',
  PLAY_FINAL_SCORE: '최종 점수',
  PLAY_NEXT_DRINK: '다음 음료',
  PLAY_SCOREBOARD: '점수판',
  PLAY_DANGER_LINE: '경고선',
  PLAY_COFFEE_RISK: '커피 위기',
  PLAY_ME: '나',
  PLAY_TAP_HINT: '탭해서 음료를 떨어뜨리세요',
  // 공격 알림 문구 만들기
  PLAY_ATTACK_NOTICE: (nickname, count) => `${nickname}님이 장애물 ${count}개를 보냈어요`,

  PLAY_MERGE_SCORES: '합체 점수',
  PLAY_NO_SCORE: '—',
  // 합체 점수 문구 만들기
  PLAY_SCORE_PLUS: (score) => `+${score}`,
  // 콤보 표시 문구 만들기
  PLAY_COMBO: (count) => `${count}콤보!`,
  // 공격을 보냈을 때 문구 만들기
  PLAY_ATTACK_SENT: (count) => `장애물 ${count}개 보냄!`,

  // 플레이 화면 테스트 페이지 (?test=play)
  DEV_ATTACK: '공격 받기',
  DEV_GAME_OVER: '게임오버',
  DEV_RESTART: '다시 시작',

  // 결과
  RESULT_TITLE: '결과',
  RESULT_COFFEE_DUTY: '오늘의 커피 담당',
  RESULT_PLAY_AGAIN: '한 판 더',
  RESULT_GO_HOME: '홈으로',
};
