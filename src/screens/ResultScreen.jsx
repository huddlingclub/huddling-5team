import { Badge } from '#components/ui/badge.jsx';
import { Button } from '#components/ui/button.jsx';
import { DRINKS } from '#game/constants.js';
import { DRINK_SPRITES } from '#game/sprites.js';
import { STRINGS } from '#strings.js';

// 커피 담당 카드에 보여줄 음료 단계 (3 = 아이스 아메리카노)
const DUTY_DRINK_LEVEL = 3;
// 이 글자 수보다 긴 닉네임은 글자를 한 단계 줄여 좁은 폰에서도 한 줄에 담는다
const DUTY_NAME_LONG_LENGTH = 8;

// 점수를 천 단위로 끊어 보여준다
function formatScore(score) {
  return Number(score).toLocaleString('ko-KR');
}

// 결과 화면: 오늘의 커피 담당을 먼저 보여주고, 그 아래 전체 순위와 다음 행동을 둔다
// 순위와 커피 담당은 호스트가 정해 보낸 값을 그대로 그린다 (화면에서 다시 계산하지 않는다)
export default function ResultScreen({ rankings = [], coffeeLoser, myNickname, onPlayAgain, onGoHome }) {
  const dutyDrink = DRINKS.find((drink) => drink.level === DUTY_DRINK_LEVEL);
  const sprite = DRINK_SPRITES[DUTY_DRINK_LEVEL];
  const loserRow = rankings.find((row) => row.nickname === coffeeLoser);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col gap-6 bg-background px-4 py-6">
      <h1 className="sr-only">{STRINGS.RESULT_TITLE}</h1>

      {coffeeLoser && (
        // 픽셀 액자 프레임: 진한 커피색, 라떼색, 흰 면을 겹쳐 도트 테두리처럼 보이게 한다
        <section aria-labelledby="coffee-duty-label" className="bg-espresso px-1 pt-1 pb-2">
          <div className="bg-latte px-1 pb-1">
            <div className="flex flex-col items-center gap-2 bg-card p-6 text-center">
              <img
                src={sprite.url}
                alt={dutyDrink.name}
                width={sprite.size}
                height={sprite.size}
                className="size-32 [image-rendering:pixelated]"
              />
              <p id="coffee-duty-label" className="text-sm text-muted-foreground">
                {STRINGS.RESULT_COFFEE_DUTY}
              </p>
              <p
                className={`line-clamp-2 max-w-full break-words font-bold leading-tight text-foreground ${
                  coffeeLoser.length > DUTY_NAME_LONG_LENGTH ? 'text-2xl' : 'text-3xl'
                }`}
              >
                {coffeeLoser}
              </p>
              {loserRow && (
                <p className="text-sm tabular-nums text-muted-foreground">
                  {formatScore(loserRow.score)}
                  {STRINGS.RESULT_SCORE_UNIT}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="ranking-title" className="flex flex-col gap-1">
        <h2 id="ranking-title" className="px-1 text-sm font-medium text-foreground">
          {STRINGS.RESULT_RANKING}
        </h2>
        <ol>
          {rankings.map((row) => {
            const isLoser = row.nickname === coffeeLoser;
            const isMe = row.nickname === myNickname;
            return (
              <li
                key={`${row.rank}-${row.nickname}`}
                className={
                  isLoser
                    ? 'mt-1 flex items-center gap-3 rounded-lg bg-foreground/10 px-3 py-2.5 text-foreground'
                    : 'flex items-center gap-3 border-b border-border px-3 py-2.5 text-foreground'
                }
              >
                <span className="w-5 text-sm tabular-nums">{row.rank}</span>
                <span className={`flex min-w-0 flex-1 items-center gap-2 text-sm ${isMe ? 'font-semibold' : ''}`}>
                  <span className="truncate">{row.nickname}</span>
                  {isMe && <Badge variant="outline">{STRINGS.RESULT_ME}</Badge>}
                  {isLoser && <Badge variant="secondary">{STRINGS.RESULT_DUTY_BADGE}</Badge>}
                </span>
                <span className="text-sm tabular-nums">{formatScore(row.score)}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-auto flex gap-3">
        {onGoHome && (
          <Button type="button" variant="secondary" size="lg" className="h-11 flex-1" onClick={onGoHome}>
            {STRINGS.RESULT_GO_HOME}
          </Button>
        )}
        {onPlayAgain && (
          <Button type="button" size="lg" className="h-11 flex-1" onClick={onPlayAgain}>
            {STRINGS.RESULT_PLAY_AGAIN}
          </Button>
        )}
      </div>
    </div>
  );
}
