import { useEffect, useState } from 'react';
import HomeScreen from '#screens/HomeScreen.jsx';
import LobbyScreen from '#screens/LobbyScreen.jsx';
import PlayScreen from '#screens/PlayScreen.jsx';
import ResultPage, { isResultPath } from '#pages/ResultPage.jsx';
import { GAME, generateNickname } from '#game/constants.js';
import { localRoomNow, useLocalRoom } from '#dev/useLocalRoom.js';

const RESULT_STORAGE_KEY = 'encantado-result';

// 화면에 보이는 시간을 다시 계산하는 주기 (ms)
const CLOCK_TICK_MS = 200;

// /result 주소로 바로 들어왔을 때 보여줄, 저장해 둔 결과를 읽는다
function readStoredResult() {
  try {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// 앱 시작, 화면 전환 상태, 게임과 방 모듈 연결
export default function App() {
  // TODO: useRoom.js가 완성되면 useLocalRoom 대신 useRoom을 쓴다 (돌려주는 값의 모양을 맞춰 둠)
  const room = useLocalRoom();
  const [now, setNow] = useState(localRoomNow);
  const [nextLevel, setNextLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  // 시간이 끝난 뒤 "시간종료!"를 지나 리더보드를 열었는지
  const [isResultOpen, setIsResultOpen] = useState(false);
  // 방 설정에서 고른 대기실 자리 수
  const [roomSettings, setRoomSettings] = useState(null);

  const isPlaying = room.status === 'playing';
  const isFinished = room.status === 'finished';

  // 게임 중에는 시계를 돌려 카운트다운과 남은 시간을 갱신한다
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => setNow(localRoomNow()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // 결과가 나오면 /result 주소에서도 다시 볼 수 있게 저장해 둔다
  useEffect(() => {
    if (room.result) sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(room.result));
  }, [room.result]);

  // 시간이 끝나면 "시간종료!"를 잠깐 보여준 뒤 리더보드로 넘어간다
  useEffect(() => {
    if (!isFinished) return undefined;
    const id = setTimeout(() => setIsResultOpen(true), GAME.TIME_UP_SHOW_MS);
    return () => clearTimeout(id);
  }, [isFinished]);

  // /result 주소로 바로 들어온 경우: 저장된 결과(없으면 예시)를 보여준다
  if (room.status === 'idle' && isResultPath()) {
    return (
      <ResultPage
        result={readStoredResult() ?? undefined}
        onGoHome={() => {
          sessionStorage.removeItem(RESULT_STORAGE_KEY);
          window.location.assign('/');
        }}
      />
    );
  }

  // 새 홈은 닉네임 입력 없이 방 설정({ maxPlayers, durationSec })이나 코드만 넘긴다.
  // 가짜 방은 닉네임을 받으므로 여기서 자동 닉네임을 만들어 맞춰 준다
  if (room.status === 'idle') {
    return (
      <HomeScreen
        onCreateRoom={(settings) => {
          setRoomSettings(settings);
          room.createRoom(generateNickname(), settings);
        }}
        onJoinRoom={(code) => {
          setRoomSettings(null);
          room.joinRoom(generateNickname(), code);
        }}
      />
    );
  }

  // 새 대기실은 player.id 와 myId 가 같은 참가자에게 "나"를 붙인다. 가짜 방 참가자는 id 가 없어 닉네임을 id 로 쓴다.
  // 자리는 설정한 인원수만큼 보여주되, 이미 들어온 참가자는 가리지 않는다
  if (room.status === 'lobby') {
    return (
      <LobbyScreen
        roomCode={room.roomCode}
        players={room.players.map((p) => ({ ...p, id: p.nickname }))}
        myId={room.myNickname}
        isHost={room.isHost}
        maxPlayers={Math.max(roomSettings?.maxPlayers ?? 0, room.players.length)}
        onStart={() => {
          setCombo(0);
          setIsResultOpen(false);
          setNow(localRoomNow());
          room.startGame();
        }}
      />
    );
  }

  // 게임 중이거나, 시간이 끝나 "시간종료!"를 보여주는 동안에는 플레이 화면을 그대로 둔다
  if (isPlaying || (isFinished && !isResultOpen)) {
    const me = room.players.find((p) => p.nickname === room.myNickname);
    const msToStart = room.startsAt - now;
    // 시작 전에는 3-2-1, 시작 직후 잠깐은 GO(0), 그 뒤에는 표시 없음(null)
    let countdown = null;
    if (msToStart > 0) countdown = Math.ceil(msToStart / 1000);
    else if (msToStart > -GAME.GO_SHOW_MS) countdown = 0;
    const timeLeft = isFinished ? 0 : Math.max(0, (room.endsAt - Math.max(now, room.startsAt)) / 1000);

    return (
      <PlayScreen
        key={room.startsAt}
        players={room.players}
        timeLeft={timeLeft}
        durationSec={room.durationSec}
        myNickname={room.myNickname}
        myScore={me?.score ?? 0}
        isGameOver={me?.alive === false}
        isTimeUp={isFinished}
        countdown={countdown}
        nextLevel={nextLevel}
        combo={combo}
        eventRound
        onScore={room.sendScore}
        onNextLevel={setNextLevel}
        onComboChange={setCombo}
        onGameOver={isFinished ? undefined : room.sendGameOver}
        onShowResult={() => setIsResultOpen(true)}
      />
    );
  }

  // "시간종료!"를 지나면 결과 화면으로 넘어간다
  if (isFinished && room.result) {
    return <ResultPage result={room.result} onGoHome={room.leave} />;
  }

  return null;
}
