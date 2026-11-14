import { useState } from 'react';
import { Copy, Share2, Loader2 } from 'lucide-react';
import { Button } from '#components/ui/button.jsx';
import { Card, CardContent } from '#components/ui/card.jsx';
import { STRINGS } from '#strings.js';
import { DRINKS } from '#game/constants.js';

// 참가자마다 고정된 음료 아이콘 (joinedAt 기반 인덱스)
const DRINK_ICONS = DRINKS.map((d) => `/assets/drinks/${d.color}.png`);

// 대기실: 방 코드 표시, 참가자 슬롯, 시작 버튼
export default function LobbyScreen({ roomCode, players, isHost, maxPlayers, myId, onStart }) {
  const slotCount = maxPlayers || players.length;
  const canStart = isHost && players.length >= 2;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: STRINGS.HOME_TITLE, text: `${STRINGS.LOBBY_CODE_LABEL}: ${roomCode}` });
    } else {
      handleCopy();
    }
  }

  // 상태 메시지
  let statusMessage;
  if (players.length < 2) {
    statusMessage = STRINGS.LOBBY_NEED_MORE;
  } else if (players.length < slotCount) {
    statusMessage = STRINGS.LOBBY_PREPARING;
  } else {
    statusMessage = STRINGS.LOBBY_ALL_JOINED;
  }

  return (
    <div className="flex items-center justify-center min-h-svh bg-background">
    <div
      className="flex flex-col items-center w-full max-w-sm min-h-svh gap-6 p-6 pt-16 bg-cover bg-top bg-no-repeat pixel-img"
      style={{ backgroundImage: "url('/assets/lobby-bg.png')" }}
    >
      <h2 className="font-pixel text-lg leading-relaxed">{STRINGS.LOBBY_TITLE}</h2>

      {/* 방 코드 */}
      <Card className="w-full max-w-xs">
        <CardContent className="flex flex-col items-center gap-3 pt-6">
          <span className="text-sm text-muted-foreground">{STRINGS.LOBBY_CODE_LABEL}</span>
          <span className="font-pixel text-2xl tracking-widest">{roomCode}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy />
              {copied ? STRINGS.LOBBY_COPIED : STRINGS.LOBBY_COPY}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 />
              {STRINGS.LOBBY_SHARE}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 참가자 슬롯 */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {Array.from({ length: slotCount }, (_, i) => {
          const player = players[i];
          if (player) {
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <img
                  src={DRINK_ICONS[i % DRINK_ICONS.length]}
                  alt=""
                  className="pixel-img w-8 h-8"
                />
                <span className="flex-1">
                  {player.nickname}
                  {i === 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">(호스트)</span>
                  )}
                </span>
                {player.id === myId && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">나</span>
                )}
              </div>
            );
          }
          return (
            <div
              key={i}
              className="flex items-center justify-center rounded-lg border border-dashed border-border px-4 py-3 text-muted-foreground animate-pulse"
            >
              {STRINGS.LOBBY_EMPTY_SLOT}
            </div>
          );
        })}
      </div>

      {/* 상태 메시지 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {players.length >= 2 && players.length < slotCount && (
          <Loader2 className="size-4 animate-spin" />
        )}
        <span>{statusMessage}</span>
      </div>

      {/* 시작 버튼 (호스트만) */}
      {isHost ? (
        <Button
          className="w-full max-w-xs pixel-shadow h-13 text-base"
          disabled={!canStart}
          onClick={onStart}
        >
          {STRINGS.LOBBY_START}
        </Button>
      ) : (
        <p className="text-muted-foreground">{STRINGS.LOBBY_WAITING}</p>
      )}
    </div>
    </div>
  );
}
