import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';
import { MOCK_RESULT, formatScore, toResultView } from '#screens/resultModel.js';
import americano from '../../docs/design-assets/drinks/americano.png';

// 결과 화면: 꼴찌(커피 당번)를 먼저 보여주고, 그 아래 전체 순위를 둔다.
export default function ResultScreen({ result = MOCK_RESULT, onGoHome }) {
  const view = toResultView(result);
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col gap-6 bg-background px-4 py-4">
      {view.loser && (
        <section className="bg-espresso px-1 pt-1 pb-2">
          <div className="bg-latte px-1 pb-1">
            <div className="flex flex-col items-center bg-card p-6 text-center">
              <img
                src={americano}
                alt={STRINGS.RESULT_AMERICANO}
                width={100}
                height={100}
                className="size-25 [image-rendering:pixelated]"
              />
              <p className="mt-4 text-sm text-foreground">{STRINGS.RESULT_COFFEE_DUTY}</p>
              <p className="mt-2 text-[32px] font-bold leading-none tracking-tight text-foreground">{view.loser.name}</p>
            </div>
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
                  ? 'mt-1 flex items-center gap-3 rounded-lg bg-foreground/10 px-3 py-2.5 text-foreground'
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
