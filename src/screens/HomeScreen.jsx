import { useState } from 'react';
import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';

// 홈 화면: 닉네임 입력 + 방 만들기 / 코드로 입장
export default function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-6">
      <h1 className="text-4xl font-bold tracking-tight">{STRINGS.HOME_TITLE}</h1>
      <p className="text-muted-foreground">{STRINGS.HOME_SUBTITLE}</p>

      <input
        type="text"
        placeholder={STRINGS.NICKNAME_PLACEHOLDER}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={10}
        className="w-full max-w-xs rounded-lg border border-input bg-background px-4 py-3 text-center text-lg"
      />

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          size="lg"
          className="w-full"
          disabled={!nickname.trim()}
          onClick={() => onCreateRoom(nickname.trim())}
        >
          {STRINGS.CREATE_ROOM}
        </Button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={STRINGS.ROOM_CODE_PLACEHOLDER}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-center text-lg tracking-widest"
          />
          <Button
            variant="secondary"
            size="lg"
            disabled={!nickname.trim() || roomCode.length < 6}
            onClick={() => onJoinRoom(nickname.trim(), roomCode)}
          >
            {STRINGS.JOIN_ROOM}
          </Button>
        </div>
      </div>
    </div>
  );
}
