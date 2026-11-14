import { STRINGS } from '#strings.js';
import GameCanvas from '#game/GameCanvas.jsx';

// 플레이 화면: 게임판 + 남은 시간 + 점수판
export default function PlayScreen({ players, timeLeft, myScore, isGameOver, onScore, onGameOver }) {
  return (
    <div className="flex flex-col items-center min-h-svh p-4 gap-4">
      {/* 상단: 남은 시간 */}
      <div className="text-lg font-mono font-bold">
        {STRINGS.PLAY_TIME_LEFT} {Math.ceil(timeLeft)}s
      </div>

      {/* 점수판 */}
      <div className="flex gap-2 w-full max-w-md">
        {players.map((p, i) => (
          <div key={i} className="flex-1 rounded-md bg-muted px-2 py-1 text-center text-sm">
            <div className="truncate">{p.nickname}</div>
            <div className="font-bold">{p.score ?? 0}</div>
          </div>
        ))}
      </div>

      {/* 게임 캔버스 */}
      <div className="flex-1 w-full max-w-sm">
        {isGameOver ? (
          <div className="flex items-center justify-center h-full text-xl font-bold text-muted-foreground">
            {STRINGS.PLAY_SPECTATING}
          </div>
        ) : (
          <GameCanvas onScore={onScore} onGameOver={onGameOver} />
        )}
      </div>
    </div>
  );
}
