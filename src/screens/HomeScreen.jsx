import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '#components/ui/button.jsx';
import { Card, CardContent } from '#components/ui/card.jsx';
import ThemeModeControl from '#components/ThemeModeControl.jsx';
import { CODE_LENGTH } from '#game/constants.js';
import { STRINGS } from '#strings.js';

// 픽셀 카페 메인 → 닉네임 입력 + 방 만들기 / 코드로 입장
export default function HomeScreen({ onCreateRoom, onJoinRoom }) {
  const [started, setStarted] = useState(false);
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <main className="min-h-svh bg-background">
      <div className="home-scene relative isolate mx-auto overflow-hidden">
        <img
          src="/assets/home/cafe-night.png"
          alt=""
          aria-hidden="true"
          width={1080}
          height={2340}
          className="absolute inset-0 hidden size-full object-cover object-bottom [image-rendering:pixelated] dark:block"
        />
        <img
          src="/assets/backgrounds/cafe-mobile.png"
          alt=""
          aria-hidden="true"
          width={390}
          height={844}
          className="absolute inset-0 size-full object-cover object-bottom [image-rendering:pixelated] dark:hidden"
        />

        {started ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-y-auto bg-background/80 p-4">
            <Card className="my-auto w-full max-w-sm">
              <CardContent className="flex flex-col gap-5 pt-4">
                <Button variant="ghost" className="h-11 self-start" onClick={() => setStarted(false)}>
                  <ArrowLeft aria-hidden="true" />
                  {STRINGS.HOME_BACK}
                </Button>
                <h1 className="text-center text-2xl font-bold">{STRINGS.HOME_TITLE}</h1>
                <p className="text-center text-sm text-muted-foreground">{STRINGS.HOME_SUBTITLE}</p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="home-nickname" className="text-sm font-medium">{STRINGS.HOME_NICKNAME}</label>
                  <input
                    id="home-nickname"
                    type="text"
                    placeholder={STRINGS.NICKNAME_PLACEHOLDER}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={10}
                    autoComplete="nickname"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg outline-ring focus-visible:outline-2"
                  />
                </div>
                <Button className="h-12 w-full" disabled={!nickname.trim()} onClick={() => onCreateRoom(nickname.trim())}>
                  {STRINGS.CREATE_ROOM}
                </Button>
                <div className="flex flex-col gap-2">
                  <label htmlFor="home-room-code" className="text-sm font-medium">{STRINGS.HOME_ROOM_CODE}</label>
                  <div className="flex gap-2">
                    <input
                      id="home-room-code"
                      type="text"
                      placeholder={STRINGS.ROOM_CODE_PLACEHOLDER}
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      maxLength={CODE_LENGTH}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-3 text-base tracking-widest outline-ring focus-visible:outline-2"
                    />
                    <Button
                      variant="secondary"
                      className="h-12 shrink-0"
                      disabled={!nickname.trim() || roomCode.length < CODE_LENGTH}
                      onClick={() => onJoinRoom(nickname.trim(), roomCode)}
                    >
                      {STRINGS.JOIN_ROOM}
                    </Button>
                  </div>
                </div>
                <ThemeModeControl />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="absolute inset-x-4 top-4 flex justify-center">
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
