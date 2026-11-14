// Presence, Broadcast 메시지 이름과 필드 정의
// 바꿀 때 전원 합의 필요

// Broadcast 메시지 이벤트 이름
export const EVENTS = {
  START: 'start',
  SCORE: 'score',
  GAME_OVER: 'gameOver',
  FINISHED: 'finished',
};

// Presence에 담는 호스트 정보
// { role: 'host', status: 'lobby' | 'playing' | 'finished', maxPlayers, durationSec, startsAt, endsAt }

// Presence에 담는 참가자 정보
// { nickname, joinedAt }

// Broadcast 메시지 필드
// start: { startsAt, endsAt }
// score: { score, maxLevel, alive }
// gameOver: { finalScore, gameOverAt }
// finished: { rankings: [{ nickname, score, rank }], coffeeLoser }
