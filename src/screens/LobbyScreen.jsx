import { Button } from '#components/ui/button.jsx';
import { Card, CardContent } from '#components/ui/card.jsx';
import { STRINGS } from '#strings.js';

// 대기실: 방 코드 표시, 참가자 목록, 시작 버튼
export default function LobbyScreen({ roomCode, players, isHost, onStart }) {
  const canStart = isHost && players.length >= 2;

  function handleCopy() {
    navigator.clipboard.writeText(roomCode);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-6">
      <h2 className="text-2xl font-semibold">{STRINGS.LOBBY_TITLE}</h2>

      <Card className="w-full max-w-xs">
        <CardContent className="flex flex-col items-center gap-2 pt-6">
          <span className="text-sm text-muted-foreground">{STRINGS.LOBBY_CODE_LABEL}</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono font-bold tracking-widest">{roomCode}</span>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {STRINGS.LOBBY_COPY}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {players.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-card px-4 py-3 text-center">
            {p.nickname} {i === 0 && '(호스트)'}
          </div>
        ))}
      </div>

      {isHost ? (
        <Button size="lg" className="w-full max-w-xs" disabled={!canStart} onClick={onStart}>
          {STRINGS.LOBBY_START}
        </Button>
      ) : (
        <p className="text-muted-foreground">{STRINGS.LOBBY_WAITING}</p>
      )}

      {isHost && players.length < 2 && (
        <p className="text-sm text-muted-foreground">{STRINGS.LOBBY_NEED_MORE}</p>
      )}
    </div>
  );
}
