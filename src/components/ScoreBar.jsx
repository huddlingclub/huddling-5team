import { Badge } from '#components/ui/badge.jsx';
import { cn } from '#lib/utils.js';
import { STRINGS } from '#strings.js';

// 참가자별 실시간 점수 바 컴포넌트 (좁은 세로 점수판용)
export default function ScoreBar({ nickname, score, maxScore, isMe, isLoser, isOut }) {
  const width = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

  return (
    <div className={cn('flex flex-col gap-1', isOut && 'opacity-60')}>
      <div className="flex items-baseline justify-between gap-1">
        <span className={cn('truncate text-sm', isMe && 'font-semibold')}>{nickname}</span>
        <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isLoser ? 'bg-destructive' : 'bg-primary',
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      {(isMe || isOut || isLoser) && (
        <div className="flex flex-wrap gap-1">
          {isMe && <Badge variant="secondary">{STRINGS.PLAY_ME}</Badge>}
          {isOut ? (
            <Badge variant="outline">{STRINGS.PLAY_GAME_OVER}</Badge>
          ) : (
            isLoser && <Badge variant="destructive">{STRINGS.PLAY_COFFEE_RISK}</Badge>
          )}
        </div>
      )}
    </div>
  );
}
