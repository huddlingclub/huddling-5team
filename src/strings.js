// 화면에 표시되는 모든 문구를 모아둔 파일
export const STRINGS = {
  // 홈 화면
  HOME_TITLE: '카페 오이시',
  HOME_START: '시작하기',
  HOME_BACK: '메인으로',
  THEME_LABEL: '화면 모드',
  THEME_LIGHT: '낮 모드',
  THEME_DARK: '밤 모드',
  THEME_SYSTEM: '기기 설정 따르기',
  HOME_SUBTITLE: '지면 커피 사는 머지 게임',
  NICKNAME_PLACEHOLDER: '닉네임을 입력하세요',
  CREATE_ROOM: '방 만들기',
  JOIN_ROOM: '입장',
  ROOM_CODE_PLACEHOLDER: '방 코드 6자리',

  // 방 만들기
  SETTING_PLAYERS: '인원수',
  SETTING_DURATION: '제한 시간',
  SETTING_FEWER: '인원 줄이기',
  SETTING_MORE: '인원 늘리기',
  SETTING_FIXED_DURATION: (minutes) => `${minutes}분 고정`,
  SETTING_EVENT_OBSTACLE: (seconds) => `${seconds}초마다 모든 참가자의 게임판에 초콜릿이 한 개씩 떨어져요.`,
  SETTING_UNIT_PLAYERS: '명',
  SETTING_MODAL_TITLE: '방 설정',
  SETTING_MODAL_DESCRIPTION: '쿠폰 이벤트에 참여할 인원수를 정해주세요.',
  SETTING_CONFIRM: '만들기',

  // 대기실
  LOBBY_TITLE: '대기실',
  LOBBY_CODE_LABEL: '방 코드',
  LOBBY_COPY: '복사',
  LOBBY_COPY_HINT: '방 코드를 직접 선택해 복사해 주세요.',
  LOBBY_COPIED: '복사됨!',
  LOBBY_START: '게임 시작',
  LOBBY_WAITING: '호스트가 시작할 때까지 대기 중...',
  LOBBY_NEED_MORE: '2명 이상이면 시작할 수 있어요',
  LOBBY_SHARE: '공유',
  LOBBY_EMPTY_SLOT: '빈 자리',
  LOBBY_PREPARING: '게임을 준비중입니다',
  LOBBY_ALL_JOINED: '모두 입장했어요!',

  // 입장 오류
  ERROR_NO_ROOM: '없는 코드예요',
  ERROR_ROOM_FULL: '방이 꽉 찼어요',
  ERROR_ALREADY_STARTED: '이미 시작된 방이에요',

  // 플레이
  PLAY_COUNTDOWN_GO: 'GO!',
  PLAY_TIME_LEFT: '남은 시간',
  PLAY_GAME_OVER: '게임오버',
  PLAY_TIME_UP: '시간종료!',
  PLAY_TIME_UP_HINT: '잠시 후 리더보드로 넘어가요',
  PLAY_SHOW_RESULT: '리더보드 보기',
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
  PLAY_EVENT_OBSTACLE: '도둑이 초콜릿을 놓고 가요!',

  PLAY_MERGE_SCORES: '합체 점수',
  PLAY_MERGE_HELP: '합체 점수표 열기',
  PLAY_MERGE_HELP_DESCRIPTION: '같은 음료를 합치면 다음 단계가 돼요. 점수표를 보는 동안에도 게임 시간은 계속 흘러요.',
  PLAY_SCORE_GAIN: '획득 점수',
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
  RESULT_MY_RECORD: '내 쿠폰 이벤트 기록',
  RESULT_MY_NICKNAME: '내 닉네임',
  RESULT_COFFEE_DUTY: '오늘의 커피 당번',
  RESULT_AMERICANO: '아이스 아메리카노',
  RESULT_PLAY_AGAIN: '한 판 더',
  RESULT_GO_HOME: '홈으로',
  RESULT_RETRY: '다시하기',
  RESULT_RANKING: '전체 순위',
  RESULT_SCORE_UNIT: '점',
  RESULT_DATE: (month, day, count) => `${month}월 ${day}일 · ${count}명 참여`,
  RESULT_TREATS: (count) => `${count}명에게 커피를 쏩니다`,
};
