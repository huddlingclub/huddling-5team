import { Coffee } from 'lucide-react';
import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';
import { MOCK_RESULT, formatScore, toResultView } from '#screens/resultModel.js';

// 결과 화면: 꼴찌(커피 당번)를 먼저 보여주고, 그 아래 전체 순위를 둔다.
export default function ResultScreen({ result = MOCK_RESULT, onGoHome }) {
  const view = toResultView(result);
  const dateLabel = STRINGS.RESULT_DATE(view.month, view.day, view.participantCount);
  const loserScoreLabel = view.loser ? `${formatScore(view.loser.score)}${STRINGS.RESULT_SCORE_UNIT}` : '';

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col gap-6 bg-background px-4 py-4">
      <header>
        <p className="text-center text-sm text-muted-foreground">{dateLabel}</p>
      </header>

      {view.loser && (
        <section className="flex flex-col items-center gap-3 rounded-2xl bg-destructive/15 px-4 py-6 text-center text-destructive">
          <p className="text-sm">{STRINGS.RESULT_COFFEE_DUTY}</p>
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/20">
            <Coffee className="size-7" />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">{view.loser.name}</p>
            <p className="mt-1 text-base font-medium">{STRINGS.RESULT_TREATS(view.treatCount)}</p>
            <p className="mt-1 text-sm">{loserScoreLabel}</p>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-1">
        <h2 className="px-1 text-sm font-medium text-foreground">{STRINGS.RESULT_RANKING}</h2>
        <ol>
          {view.rows.map((row) => (
            <li
              key={row.name}
              className={
                row.isLoser
                  ? 'mt-1 flex items-center gap-3 rounded-lg bg-destructive/15 px-3 py-2.5 text-destructive'
                  : 'flex items-center gap-3 border-b border-border px-3 py-2.5 text-foreground'
              }
            >
              <span className="w-4 text-sm tabular-nums">{row.rank}</span>
              <span className="flex-1 text-sm">{row.name}</span>
              <span className="text-sm tabular-nums">{formatScore(row.score)}</span>
            </li>
          ))}
        </ol>
      </section>

      <Button type="button" size="lg" className="mt-auto w-full" onClick={onGoHome}>
        {STRINGS.RESULT_RETRY}
      </Button>
    </div>
  );
}
