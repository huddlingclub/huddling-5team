import { useState } from 'react';
import HomeScreen from '#screens/HomeScreen.jsx';
import LobbyScreen from '#screens/LobbyScreen.jsx';
import PlayScreen from '#screens/PlayScreen.jsx';
import ResultScreen from '#screens/ResultScreen.jsx';
import { useRoom } from '#room/useRoom.js';

// 앱 시작, 화면 전환 상태, 게임과 방 모듈 연결
export default function App() {
  const [screen, setScreen] = useState('home');
  const room = useRoom();

  if (screen === 'home') {
    return (
      <HomeScreen
        error={room.error}
        onCreateRoom={async (settings) => {
          await room.createRoom(settings);
          setScreen('lobby');
        }}
        onJoinRoom={async (code) => {
          const ok = await room.joinRoom(code);
          if (ok) setScreen('lobby');
        }}
      />
    );
  }

  if (screen === 'lobby') {
    return (
      <LobbyScreen
        roomCode={room.roomCode}
        players={room.players}
        isHost={room.isHost}
        maxPlayers={room.maxPlayers}
        onStart={async () => {
          await room.startGame();
          setScreen('play');
        }}
      />
    );
  }

  if (screen === 'play') {
    return (
      <PlayScreen
        players={room.players}
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
        onGoHome={() => {
          room.leaveRoom();
          setScreen('home');
        }}
      />
    );
  }

  return null;
}
