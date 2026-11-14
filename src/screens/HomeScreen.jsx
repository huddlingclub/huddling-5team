import { useState } from 'react';
import { Button } from '#components/ui/button.jsx';
import RoomSettingsModal from '#components/RoomSettingsModal.jsx';
import { STRINGS } from '#strings.js';
import { CODE_LENGTH } from '#game/constants.js';

// 홈 화면: 방 만들기 + 코드 입장
export default function HomeScreen({ onCreateRoom, onJoinRoom, error }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [code, setCode] = useState('');

  function handleCodeChange(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH);
    setCode(val);
  }

  return (
    <div className="flex items-center justify-center min-h-svh bg-background">
    <div
      className="relative flex flex-col items-center justify-end w-full max-w-sm min-h-svh p-6 pb-30 gap-6 bg-cover bg-top bg-no-repeat pixel-img"
      style={{ backgroundImage: "url('/assets/cafe-bg.png')" }}
    >
      <img
        src="/assets/title-logo.png"
        alt="카페 오이시"
        className="absolute top-30 pixel-img w-64"
      />

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          className="w-full pixel-shadow h-13 text-base"
          onClick={() => setSettingsOpen(true)}
        >
          {STRINGS.CREATE_ROOM}
        </Button>

        <span className="text-center text-sm text-muted-foreground">or</span>

        {/* 코드 입장 */}
        <div className="flex gap-2">
          <input
            className="flex-1 h-13 rounded-lg border border-border bg-background px-4 text-center text-base font-mono tracking-widest uppercase placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
            type="text"
            inputMode="text"
            maxLength={CODE_LENGTH}
            placeholder={STRINGS.ROOM_CODE_PLACEHOLDER}
            value={code}
            onChange={handleCodeChange}
          />
          <Button
            variant="secondary"
            className="h-13 px-5 text-base bg-secondary"
            disabled={code.length < CODE_LENGTH}
            onClick={() => onJoinRoom(code)}
          >
            {STRINGS.JOIN_ROOM}
          </Button>
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}
      </div>

      <RoomSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConfirm={(settings) => {
          setSettingsOpen(false);
          onCreateRoom(settings);
        }}
      />
    </div>
    </div>
  );
}
