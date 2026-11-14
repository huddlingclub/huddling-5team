import { useEffect, useState } from 'react';
import HomeScreen from '#screens/HomeScreen.jsx';
import LobbyScreen from '#screens/LobbyScreen.jsx';
import PlayScreen from '#screens/PlayScreen.jsx';
import ResultPage, { isResultPath } from '#pages/ResultPage.jsx';
import { GAME } from '#game/constants.js';
import { getAttackCount } from '#game/engine.js';
import { useLocalRoom } from '#dev/useLocalRoom.js';

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
  const [now, setNow] = useState(() => Date.now());
  const [nextLevel, setNextLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [sentAttack, setSentAttack] = useState(null);

  const isPlaying = room.status === 'playing';

  // 게임 중에는 시계를 돌려 카운트다운과 남은 시간을 갱신한다
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // 보낸 공격 안내를 잠깐 보여주고 지운다
  useEffect(() => {
    if (!sentAttack) return undefined;
    const id = setTimeout(() => setSentAttack(null), GAME.NOTICE_MS);
    return () => clearTimeout(id);
  }, [sentAttack]);

  // 결과가 나오면 /result 주소에서도 다시 볼 수 있게 저장해 둔다
  useEffect(() => {
    if (room.result) sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(room.result));
  }, [room.result]);

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

  if (room.status === 'idle') {
    return <HomeScreen onCreateRoom={room.createRoom} onJoinRoom={room.joinRoom} />;
  }

  if (room.status === 'lobby') {
    return (
      <LobbyScreen
        roomCode={room.roomCode}
        players={room.players}
        isHost={room.isHost}
        onStart={() => {
          setCombo(0);
          setSentAttack(null);
          setNow(Date.now());
          room.startGame();
        }}
      />
    );
  }

  if (room.status === 'playing') {
    const me = room.players.find((p) => p.nickname === room.myNickname);
    const msToStart = room.startsAt - now;
    // 시작 전에는 3-2-1, 시작 직후 잠깐은 GO(0), 그 뒤에는 표시 없음(null)
    let countdown = null;
    if (msToStart > 0) countdown = Math.ceil(msToStart / 1000);
    else if (msToStart > -GAME.GO_SHOW_MS) countdown = 0;
    const timeLeft = Math.max(0, (room.endsAt - Math.max(now, room.startsAt)) / 1000);

    return (
      <PlayScreen
        key={room.startsAt}
        players={room.players}
        timeLeft={timeLeft}
        durationSec={room.durationSec}
        myNickname={room.myNickname}
        myScore={me?.score ?? 0}
        isGameOver={me?.alive === false}
        countdown={countdown}
        nextLevel={nextLevel}
        combo={combo}
        sentAttack={sentAttack}
        onScore={room.sendScore}
        onNextLevel={setNextLevel}
        onComboChange={setCombo}
        onCombo={(count) => setSentAttack({ count: getAttackCount(count) })}
        onGameOver={room.sendGameOver}
      />
    );
  }

  // 제한 시간이 끝나면 게임을 멈추고 결과 화면으로 넘어간다
  if (room.status === 'finished' && room.result) {
    return <ResultPage result={room.result} onGoHome={room.leave} />;
  }

  return null;
}
