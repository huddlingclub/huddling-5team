import { useLayoutEffect, useRef } from 'react';
import { Button } from '#components/ui/button.jsx';
import BeanBurst from '#components/BeanBurst.jsx';
import { STRINGS } from '#strings.js';
import { MOCK_RESULT, formatScore, toResultView } from '#screens/resultModel.js';
import americano from '../../docs/design-assets/drinks/americano.png';
import cafeBackground from '../../docs/design-assets/backgrounds/cafe.png';

const ROW_START_MS = 600;
const ROW_GAP_MS = 50;
const ROW_DURATION_MS = 280;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// 결과 화면: 꼴찌(커피 당번)를 먼저 보여주고, 그 아래 전체 순위를 둔다.
export default function ResultScreen({ result = MOCK_RESULT, onGoHome }) {
  const view = toResultView(result);
  const reduceMotion = prefersReducedMotion();
  const cardRef = useRef(null);
  const cupRef = useRef(null);
  const nameRef = useRef(null);
  const rowRefs = useRef([]);

  useLayoutEffect(() => {
    if (reduceMotion) return undefined;
    const animations = [];

    if (cardRef.current) {
      animations.push(cardRef.current.animate(
        [
          { transform: 'scale(0.85)', opacity: 0 },
          { transform: 'scale(1.04)', opacity: 1, offset: 0.6 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 450, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)', fill: 'both' },
      ));
    }

    if (nameRef.current) {
      animations.push(nameRef.current.animate(
        [
          { transform: 'scale(1.7)', opacity: 0 },
          { transform: 'scale(0.94)', opacity: 1, offset: 0.72 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 320, delay: 400, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)', fill: 'both' },
      ));
    }

    const rows = rowRefs.current.filter(Boolean);
    let loserEntrance = null;
    rows.forEach((row, index) => {
      const entrance = row.animate(
        [
          { transform: 'translateY(16px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        { duration: ROW_DURATION_MS, delay: ROW_START_MS + index * ROW_GAP_MS, easing: 'ease-out', fill: 'both' },
      );
      animations.push(entrance);
      if (row.dataset.loser === 'true') loserEntrance = entrance;
    });

    const loser = rows.find((row) => row.dataset.loser === 'true');
    const shakeDelay = ROW_START_MS + Math.max(rows.length - 1, 0) * ROW_GAP_MS + ROW_DURATION_MS;
    const shakeTimer = window.setTimeout(() => {
      if (!loser) return;
      loserEntrance?.cancel();
      animations.push(loser.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-6px)', offset: 0.25 },
          { transform: 'translateX(6px)', offset: 0.5 },
          { transform: 'translateX(-3px)', offset: 0.75 },
          { transform: 'translateX(0)' },
        ],
        { duration: 380, easing: 'ease-in-out' },
      ));
    }, shakeDelay);

    return () => {
      window.clearTimeout(shakeTimer);
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduceMotion]);

  return (
    <div className="min-h-svh bg-background">
      <div
        className="mx-auto flex min-h-svh w-full max-w-sm flex-col gap-6 bg-cover bg-center bg-no-repeat px-4 py-4 [image-rendering:pixelated]"
        style={{ backgroundImage: `url(${cafeBackground})` }}
      >
        {view.loser && !reduceMotion && <BeanBurst originRef={cupRef} />}
        {view.loser && (
          <section ref={cardRef} className="bg-espresso px-1 pt-1 pb-2">
            <div className="bg-latte px-1 pb-1">
              <div className="flex flex-col items-center bg-card p-6 text-center">
                <img
                  ref={cupRef}
                  src={americano}
                  alt={STRINGS.RESULT_AMERICANO}
                  width={100}
                  height={100}
                  className="size-25 [image-rendering:pixelated]"
                />
                <p className="mt-4 text-sm text-foreground">{STRINGS.RESULT_COFFEE_DUTY}</p>
                <p ref={nameRef} className="mt-2 text-[32px] font-bold leading-none tracking-tight text-foreground">{view.loser.name}</p>
              </div>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-1">
          <h2 className="px-1 text-sm font-medium text-foreground">{STRINGS.RESULT_RANKING}</h2>
          <ol>
            {view.rows.map((row, index) => (
              <li
                key={row.name}
                ref={(el) => { rowRefs.current[index] = el; }}
                data-loser={row.isLoser ? 'true' : undefined}
                className={
                  row.isLoser
                    ? 'mt-1 flex items-center gap-3 rounded-lg border-2 border-result-loser-border bg-result-loser px-3 py-2.5 text-foreground'
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
    </div>
  );
}
