import { useEffect, useState } from 'react';
import HomeScreen from '#screens/HomeScreen.jsx';
import LobbyScreen from '#screens/LobbyScreen.jsx';
import PlayScreen from '#screens/PlayScreen.jsx';
import ResultPage, { RESULT_PATH, isResultPath } from '#pages/ResultPage.jsx';

const RESULT_STORAGE_KEY = 'encantado-result';

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
  const [screen, setScreen] = useState(() => (isResultPath() ? 'result' : 'home'));
  const [result, setResult] = useState(() => (isResultPath() ? readStoredResult() : null));

  useEffect(() => {
    function showScreenForPath() {
      const onResult = isResultPath();
      setResult(onResult ? readStoredResult() : null);
      setScreen(onResult ? 'result' : 'home');
    }
    window.addEventListener('popstate', showScreenForPath);
    return () => window.removeEventListener('popstate', showScreenForPath);
  }, []);

  function openResult(nextResult) {
    if (nextResult) {
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(nextResult));
    } else {
      sessionStorage.removeItem(RESULT_STORAGE_KEY);
    }
    if (!isResultPath()) {
      window.location.assign(RESULT_PATH);
      return;
    }
    setResult(nextResult ?? null);
    setScreen('result');
  }

  function leaveResult() {
    sessionStorage.removeItem(RESULT_STORAGE_KEY);
    window.location.assign('/');
  }

  // TODO: useRoom 훅 연결, 화면 전환 로직 구현

  if (screen === 'home') {
    return (
      <HomeScreen
        onCreateRoom={(nickname) => {
          // TODO: 방 만들기 → 대기실로 전환
          setScreen('lobby');
        }}
        onJoinRoom={(nickname, code) => {
          // TODO: 방 입장 → 대기실로 전환
          setScreen('lobby');
        }}
      />
    );
  }

  if (screen === 'lobby') {
    return (
      <LobbyScreen
        roomCode="ABC123"
        players={[{ nickname: '테스트' }]}
        isHost={true}
        onStart={() => setScreen('play')}
      />
    );
  }

  if (screen === 'play') {
    return (
      <PlayScreen
        players={[{ nickname: '테스트', score: 0 }]}
        timeLeft={120}
        myScore={0}
        isGameOver={false}
        onScore={() => {}}
        onGameOver={() => openResult()}
      />
    );
  }

  if (screen === 'result') {
    return <ResultPage result={result ?? undefined} onBack={leaveResult} />;
  }

  return null;
}
