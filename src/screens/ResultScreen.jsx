import { Button } from '#components/ui/button.jsx';
import { Card, CardContent } from '#components/ui/card.jsx';
import { STRINGS } from '#strings.js';

// 결과 화면: 순위표 + 커피 담당
export default function ResultScreen({ rankings, coffeeLoser, onPlayAgain, onGoHome }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-6">
      <h2 className="text-2xl font-semibold">{STRINGS.RESULT_TITLE}</h2>

      {/* 커피 담당 */}
      <Card className="w-full max-w-xs border-destructive">
        <CardContent className="flex flex-col items-center gap-2 pt-6">
          <span className="text-sm text-muted-foreground">{STRINGS.RESULT_COFFEE_DUTY}</span>
          <span className="text-3xl font-bold">{coffeeLoser}</span>
        </CardContent>
      </Card>

      {/* 순위표 */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {rankings.map((r, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
              r.nickname === coffeeLoser ? 'border-destructive bg-destructive/10' : 'border-border bg-card'
            }`}
          >
            <span className="font-mono font-bold">{r.rank}</span>
            <span>{r.nickname}</span>
            <span className="font-mono">{r.score}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="secondary" className="flex-1" onClick={onGoHome}>
          {STRINGS.RESULT_GO_HOME}
        </Button>
        <Button className="flex-1" onClick={onPlayAgain}>
          {STRINGS.RESULT_PLAY_AGAIN}
        </Button>
      </div>
    </div>
  );
}
