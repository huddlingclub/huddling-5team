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
            <h1 className="home-logo absolute left-1/2 -translate-x-1/2">
              <img src="/assets/home/cafe-oishi-logo.png" alt={STRINGS.HOME_TITLE} width={920} height={250} className="h-auto w-full [image-rendering:pixelated]" />
            </h1>
            <Button
              variant="ghost"
              aria-label={STRINGS.HOME_START}
              onClick={() => setStarted(true)}
              className="home-start group absolute left-1/2 h-auto -translate-x-1/2 rounded-none border-0 p-0 hover:bg-transparent"
            >
              <img src="/assets/home/start-default.png" alt="" width={546} height={216} className="h-auto w-full [image-rendering:pixelated] group-hover:hidden group-focus-visible:hidden group-active:hidden" />
              <img src="/assets/home/start-active.png" alt="" width={546} height={216} className="hidden h-auto w-full [image-rendering:pixelated] group-hover:block group-focus-visible:block group-active:block" />
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
