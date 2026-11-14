import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';
import { MOCK_RESULT, formatScore, toResultView } from '#screens/resultModel.js';

// 결과 화면: 꼴찌(커피 당번)를 먼저 보여주고, 그 아래 전체 순위를 둔다.
export default function ResultScreen({ result = MOCK_RESULT, onGoHome }) {
  const view = toResultView(result);
  const dateLabel = STRINGS.RESULT_DATE(view.month, view.day, view.participantCount);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col gap-6 bg-background px-4 py-4">
      <header>
        <p className="text-center text-sm text-muted-foreground">{dateLabel}</p>
      </header>

      {view.loser && (
        <section className="flex flex-col items-center rounded-3xl bg-card px-6 py-8 text-center">
          <div className="size-36 rounded-full bg-foreground/10" aria-hidden="true" />
          <p className="mt-6 text-sm text-foreground">{STRINGS.RESULT_COFFEE_DUTY}</p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-foreground">{view.loser.name}</p>
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
