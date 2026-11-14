// 화면에 표시되는 모든 문구를 모아둔 파일
export const STRINGS = {
  // 홈 화면
  HOME_TITLE: '커피내기 머지',
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

  // 결과
  RESULT_TITLE: '결과',
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
