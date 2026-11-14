// 혼자 처음부터 끝까지 돌려보기 위한 가짜 방 (네트워크 없음, 상대는 자동으로 점수가 오르는 봇)
// useRoom.js가 완성되면 App.jsx에서 이 훅 대신 useRoom을 쓰면 된다

import { useEffect, useState } from 'react';
import { CODE_CHARS, CODE_LENGTH, GAME, ROOM } from '#game/constants.js';

// 테스트용 가짜 값 (실제 게임 숫자가 아님)
const BOT_NICKNAMES = ['지민(봇)', '하늘(봇)'];
const BOT_TICK_MS = 1000;
const BOT_SCORE_MAX_STEP = 8;
const BOT_MAX_LEVEL = 3;

// 기기 시계를 바꿔도 쿠폰 이벤트의 경과 시간은 그대로 흐른다.
export function localRoomNow() {
  return performance.timeOrigin + performance.now();
}

// 무작위 방 코드를 만든다
function createCode() {
  return Array.from({ length: CODE_LENGTH }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
}

// 결과 화면(ResultScreen)이 받는 모양으로 최종 결과를 만든다
function createResult(players, myNickname) {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    myNickname,
    date: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
    players: players.map((p) => ({ name: p.nickname, score: p.score, finished: true })),
  };
}

// 0점인 참가자 하나를 만든다
function createPlayer(nickname, isBot) {
  return { nickname, isBot, score: 0, maxLevel: isBot ? BOT_MAX_LEVEL : 0, alive: true, gameOverAt: null };
}

export function useLocalRoom() {
  const [status, setStatus] = useState('idle'); // idle | lobby | playing | finished
  const [roomCode, setRoomCode] = useState('');
  const [myNickname, setMyNickname] = useState('');
  const [players, setPlayers] = useState([]);
  const [startsAt, setStartsAt] = useState(null);
  const [endsAt, setEndsAt] = useState(null);
  const [result, setResult] = useState(null);

  // 나와 봇들로 대기실을 채운다
  function enterLobby(nickname, code, settings = {}) {
    const capacity = settings.maxPlayers ?? ROOM.DEFAULT_PLAYERS;
    const bots = BOT_NICKNAMES.slice(0, capacity - 1);
    setMyNickname(nickname);
    setRoomCode(code);
    setPlayers([createPlayer(nickname, false), ...bots.map((name) => createPlayer(name, true))]);
    setResult(null);
    setStatus('lobby');
  }

  // 내 정보만 바꾼다
  function updateMe(patch) {
    if (status !== 'playing' || localRoomNow() >= endsAt) return;
    setPlayers((list) => list.map((p) => (p.isBot ? p : { ...p, ...patch })));
  }

  // 라운드 종료는 봇의 다음 점수 갱신을 기다리지 않고 마감 시각에 처리한다.
  useEffect(() => {
    if (status !== 'playing') return undefined;
    const finishTimer = setTimeout(() => setStatus('finished'), Math.max(0, Math.ceil(endsAt - localRoomNow())));
    const id = setInterval(() => {
      const now = localRoomNow();
      if (now < startsAt || now >= endsAt) return;
      setPlayers((list) =>
        list.map((p) => (p.isBot ? { ...p, score: p.score + Math.floor(Math.random() * BOT_SCORE_MAX_STEP) } : p)),
      );
    }, BOT_TICK_MS);
    return () => {
      clearInterval(id);
      clearTimeout(finishTimer);
    };
  }, [status, startsAt, endsAt]);

  // 종료되면 마지막 점수로 결과를 확정한다
  useEffect(() => {
    if (status === 'finished') setResult((prev) => prev ?? createResult(players, myNickname));
  }, [status, players, myNickname]);

  return {
    status,
    roomCode,
    myNickname,
    players,
    isHost: true,
    durationSec: ROOM.DURATION_SEC,
    startsAt,
    endsAt,
    result,
    // 방 만들기
    createRoom: (nickname, settings) => enterLobby(nickname, createCode(), settings),
    // 코드로 입장 (가짜 방이라 어떤 코드든 들어간다)
    joinRoom: (nickname, code) => enterLobby(nickname, code),
    // 게임 시작: 카운트다운 뒤 시작하도록 시각을 정한다
    startGame: () => {
      const start = localRoomNow() + GAME.COUNTDOWN_SEC * 1000;
      setPlayers((list) => list.map((p) => createPlayer(p.nickname, p.isBot)));
      setStartsAt(start);
      setEndsAt(start + ROOM.DURATION_SEC * 1000);
      setResult(null);
      setStatus('playing');
    },
    // 내 현재 총점 보내기
    sendScore: (score, maxLevel) => updateMe({ score, maxLevel }),
    // 내 게임오버 알리기
    sendGameOver: (finalScore) => updateMe({ score: finalScore, alive: false, gameOverAt: Date.now() }),
    // 같은 멤버로 대기실로 돌아가기
    playAgain: () => setStatus('lobby'),
    // 방 나가기
    leave: () => setStatus('idle'),
  };
}
