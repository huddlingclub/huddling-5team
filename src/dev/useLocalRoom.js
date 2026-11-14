// 혼자 처음부터 끝까지 돌려보기 위한 가짜 방 (네트워크 없음, 상대는 자동으로 점수가 오르는 봇)
// useRoom.js가 완성되면 App.jsx에서 이 훅 대신 useRoom을 쓰면 된다

import { useEffect, useState } from 'react';
import { CODE_CHARS, CODE_LENGTH, GAME, ROOM } from '#game/constants.js';
import { judge } from '#game/judge.js';

// 테스트용 가짜 값 (실제 게임 숫자가 아님)
const BOT_NICKNAMES = ['지민(봇)', '하늘(봇)'];
const BOT_TICK_MS = 1000;
const BOT_SCORE_MAX_STEP = 8;
const BOT_MAX_LEVEL = 3;

// 무작위 방 코드를 만든다
function createCode() {
  return Array.from({ length: CODE_LENGTH }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
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
  const [durationSec] = useState(ROOM.DEFAULT_DURATION_SEC);
  const [startsAt, setStartsAt] = useState(null);
  const [endsAt, setEndsAt] = useState(null);
  const [result, setResult] = useState(null);

  // 나와 봇들로 대기실을 채운다
  function enterLobby(nickname, code) {
    setMyNickname(nickname);
    setRoomCode(code);
    setPlayers([createPlayer(nickname, false), ...BOT_NICKNAMES.map((name) => createPlayer(name, true))]);
    setResult(null);
    setStatus('lobby');
  }

  // 내 정보만 바꾼다
  function updateMe(patch) {
    setPlayers((list) => list.map((p) => (p.isBot ? p : { ...p, ...patch })));
  }

  // 게임 중: 봇 점수를 올리고, 종료 시각이 지나면 판정한다
  useEffect(() => {
    if (status !== 'playing') return undefined;
    const id = setInterval(() => {
      const now = Date.now();
      if (now >= endsAt) {
        setStatus('finished');
        return;
      }
      if (now < startsAt) return;
      setPlayers((list) =>
        list.map((p) => (p.isBot ? { ...p, score: p.score + Math.floor(Math.random() * BOT_SCORE_MAX_STEP) } : p)),
      );
    }, BOT_TICK_MS);
    return () => clearInterval(id);
  }, [status, startsAt, endsAt]);

  // 종료되면 마지막 점수로 순위와 커피 담당을 정한다
  useEffect(() => {
    if (status === 'finished') setResult((prev) => prev ?? judge(players));
  }, [status, players]);

  return {
    status,
    roomCode,
    myNickname,
    players,
    isHost: true,
    durationSec,
    startsAt,
    endsAt,
    result,
    // 방 만들기
    createRoom: (nickname) => enterLobby(nickname, createCode()),
    // 코드로 입장 (가짜 방이라 어떤 코드든 들어간다)
    joinRoom: (nickname, code) => enterLobby(nickname, code),
    // 게임 시작: 카운트다운 뒤 시작하도록 시각을 정한다
    startGame: () => {
      const start = Date.now() + GAME.COUNTDOWN_SEC * 1000;
      setPlayers((list) => list.map((p) => createPlayer(p.nickname, p.isBot)));
      setStartsAt(start);
      setEndsAt(start + durationSec * 1000);
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
