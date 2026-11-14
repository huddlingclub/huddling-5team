import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '#components/ui/button.jsx';
import { Card, CardContent } from '#components/ui/card.jsx';
import ThemeModeControl from '#components/ThemeModeControl.jsx';
import RoomSettingsModal from '#components/RoomSettingsModal.jsx';
import { CODE_LENGTH } from '#game/constants.js';
import { STRINGS } from '#strings.js';

export default function HomeScreen({ onCreateRoom, onJoinRoom, error }) {
  const [started, setStarted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  function joinRoom(event) {
    event.preventDefault();
    if (roomCode.length === CODE_LENGTH) onJoinRoom(roomCode);
  }

  return (
    <main className="min-h-svh bg-home-backdrop">
      <div className="home-scene relative isolate mx-auto overflow-hidden">
        {started ? (
          <div className="absolute inset-0 flex flex-col items-center overflow-y-auto bg-espresso/25 px-4 py-6">
            <Card className="cafe-panel my-auto w-full shrink-0 md:max-w-xs">
              <CardContent className="flex flex-col gap-4">
                <Button variant="ghost" className="h-11 self-start" onClick={() => setStarted(false)}>
                  <ArrowLeft aria-hidden="true" />
                  {STRINGS.HOME_BACK}
                </Button>
                <h1 className="mx-auto w-4/5">
                  <img src="/assets/home/cafe-oishi-logo.png" alt={STRINGS.HOME_TITLE} width={920} height={250} className="pixel-img h-auto w-full" />
                </h1>
                <Button className="pixel-shadow h-12 w-full" onClick={() => setSettingsOpen(true)}>
                  {STRINGS.CREATE_ROOM}
                </Button>
                <form onSubmit={joinRoom} className="flex flex-col gap-2 border-t pt-4">
                  <label htmlFor="home-room-code" className="text-sm font-medium">{STRINGS.LOBBY_CODE_LABEL}</label>
                  <div className="flex gap-2">
                    <input
                      id="home-room-code"
                      type="text"
                      placeholder={STRINGS.ROOM_CODE_PLACEHOLDER}
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      maxLength={CODE_LENGTH}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-3 text-base tracking-widest outline-ring focus-visible:outline-2"
                    />
                    <Button
                      variant="secondary"
                      className="h-12 shrink-0"
                      type="submit"
                      disabled={roomCode.length !== CODE_LENGTH}
                    >
                      {STRINGS.JOIN_ROOM}
                    </Button>
                  </div>
                  {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                </form>
              </CardContent>
            </Card>
            <RoomSettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              onConfirm={(settings) => {
                setSettingsOpen(false);
                onCreateRoom(settings);
              }}
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-x-4 top-4 flex justify-end">
              <ThemeModeControl />
            </div>
            <div className="home-actions absolute inset-x-0 mx-auto flex flex-col items-center">
              <h1 className="home-logo pb-3">
                <img src="/assets/home/cafe-oishi-logo.png" alt={STRINGS.HOME_TITLE} width={920} height={250} className="h-auto w-full [image-rendering:pixelated]" />
              </h1>
              <Button
                type="button"
                variant="ghost"
                aria-label={STRINGS.HOME_START}
                onClick={() => setStarted(true)}
                className="home-start group relative h-auto min-h-11 touch-manipulation rounded-none border-0 p-0 transition-none hover:bg-transparent active:not-aria-[haspopup]:translate-y-0"
              >
                {/* 기본 그림이 항상 자리를 유지하게 해 터치 중 클릭 대상이 사라지지 않도록 한다. */}
                <img src="/assets/home/start-default.png" alt="" width={546} height={216} draggable={false} className="pointer-events-none block h-auto w-full select-none [image-rendering:pixelated]" />
                <img src="/assets/home/start-active.png" alt="" width={546} height={216} draggable={false} className="pointer-events-none absolute inset-0 size-full object-contain opacity-0 select-none [image-rendering:pixelated] group-focus-visible:opacity-100 group-active:opacity-100 pointer-fine:group-hover:opacity-100" />
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
