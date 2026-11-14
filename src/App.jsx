import { useState } from 'react';
import HomeScreen from '#screens/HomeScreen.jsx';
import LobbyScreen from '#screens/LobbyScreen.jsx';
import PlayScreen from '#screens/PlayScreen.jsx';
import ResultScreen from '#screens/ResultScreen.jsx';

// 앱 시작, 화면 전환 상태, 게임과 방 모듈 연결
export default function App() {
  const [screen, setScreen] = useState('home');

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
        onGameOver={() => setScreen('result')}
      />
    );
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        rankings={[{ rank: 1, nickname: '테스트', score: 100 }]}
        coffeeLoser="테스트"
        onPlayAgain={() => setScreen('lobby')}
        onGoHome={() => setScreen('home')}
      />
    );
  }

  return null;
}
