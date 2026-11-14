import { Timer } from 'lucide-react';
import { Badge } from '#components/ui/badge.jsx';
import { Card, CardContent } from '#components/ui/card.jsx';
import { Progress } from '#components/ui/progress.jsx';
import ScoreBar from '#components/ScoreBar.jsx';
import GameCanvas from '#game/GameCanvas.jsx';
import { COMBO, DRINKS, GAME, ROOM, UNICORN_BONUS } from '#game/constants.js';
import { DRINK_SPRITES, PLAY_BACKGROUNDS } from '#game/sprites.js';
import { cn } from '#lib/utils.js';
import { STRINGS } from '#strings.js';

// 남은 시간이 이 값(초) 이하면 타이머를 경고색으로 바꾼다
const LOW_TIME_SEC = 10;

// 초를 "분:초" 형태로 바꾼다
function formatTime(sec) {
  const total = Math.max(0, Math.ceil(sec));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

// 다음에 떨어질 음료 미리보기
function NextDrink({ level }) {
  const drink = DRINKS.find((d) => d.level === level) ?? DRINKS[0];

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end">
        <span className="text-xs text-muted-foreground">{STRINGS.PLAY_NEXT_DRINK}</span>
        <span className="text-sm font-medium">{drink.name}</span>
      </div>
      <img
        src={DRINK_SPRITES[drink.level].url}
        alt={drink.name}
        className="size-10 shrink-0 [image-rendering:pixelated]"
      />
    </div>
  );
}

// 음료 그림 아이콘 하나
function DrinkIcon({ drink, className }) {
  return (
    <img
      src={DRINK_SPRITES[drink.level].url}
      alt={drink.name}
      title={drink.name}
      className={cn('size-6 shrink-0 [image-rendering:pixelated]', className)}
    />
  );
}

// 음료가 만들어질 때 얻는 점수 표 (마지막 줄은 최종 단계끼리 만났을 때 보너스)
function MergeScoreTable() {
  const lastDrink = DRINKS[DRINKS.length - 1];

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">{STRINGS.PLAY_MERGE_SCORES}</span>
        {DRINKS.map((drink) => (
          <div key={drink.level} className="flex items-center justify-between gap-2">
            <DrinkIcon drink={drink} />
            <span className="font-mono text-sm font-semibold tabular-nums">
              {drink.mergeScore > 0 ? STRINGS.PLAY_SCORE_PLUS(drink.mergeScore) : STRINGS.PLAY_NO_SCORE}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-2 border-t pt-1.5">
          <div className="flex">
            <DrinkIcon drink={lastDrink} />
            <DrinkIcon drink={lastDrink} className="-ml-2" />
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {STRINGS.PLAY_SCORE_PLUS(UNICORN_BONUS)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// 컵 위를 덮는 안내 층 (카운트다운, 게임오버)
function CupOverlay({ children }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 p-4 text-center">
      {children}
    </div>
  );
}

// 플레이 화면: 게임판 + 남은 시간 + 점수판
export default function PlayScreen({
  players,
  timeLeft,
  durationSec = ROOM.DEFAULT_DURATION_SEC,
  myNickname,
  myScore,
  isGameOver,
  countdown = null,
  nextLevel = 1,
  notice = null,
  combo = 0,
  sentAttack = null,
  onScore,
  onNextLevel,
  onComboChange,
  onCombo,
  onGameOver,
}) {
  const scores = players.map((p) => p.score ?? 0);
  const maxScore = Math.max(...scores, 1);
  const minScore = Math.min(...scores);
  // 점수 차이가 생긴 뒤에만 최저 점수자를 표시한다
  const hasGap = players.length > 1 && Math.max(...scores) > minScore;
  const isLowTime = timeLeft <= LOW_TIME_SEC;
  const isCounting = countdown !== null;

  return (
    <div className="mx-auto flex h-svh w-full max-w-sm flex-col gap-3 p-4">
      {/* 화면 전체에 까는 카페 배경 */}
      <picture>
        <source media={PLAY_BACKGROUNDS.desktop.media} srcSet={PLAY_BACKGROUNDS.desktop.url} />
        <source media={PLAY_BACKGROUNDS.mobileSmall.media} srcSet={PLAY_BACKGROUNDS.mobileSmall.url} />
        <img
          src={PLAY_BACKGROUNDS.mobile}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 size-full object-cover object-bottom [image-rendering:pixelated]"
        />
      </picture>

      {/* 상단: 남은 시간 + 내 점수 + 다음 음료 */}
      <Card size="sm">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{STRINGS.PLAY_TIME_LEFT}</span>
              <span
                className={cn(
                  'flex items-center gap-1 font-mono text-2xl font-bold tabular-nums',
                  isLowTime && 'text-destructive',
                )}
              >
                <Timer className="size-5" />
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground">{STRINGS.PLAY_MY_SCORE}</span>
              <span className="font-mono text-2xl font-bold tabular-nums">{myScore}</span>
            </div>
            <NextDrink level={nextLevel} />
          </div>
          <Progress
            value={Math.max(0, Math.min((timeLeft / durationSec) * 100, 100))}
            aria-label={STRINGS.PLAY_TIME_LEFT}
            className={cn(isLowTime && '**:data-[slot=progress-indicator]:bg-destructive')}
          />
        </CardContent>
      </Card>

      {/* 아래: 컵(왼쪽) + 점수판(오른쪽) */}
      <div className="flex min-h-0 flex-1 gap-3">
        {/* 컵(게임판) */}
        <div className="board-frame relative h-full min-w-0 flex-1 overflow-hidden">
          {/* 경고선 */}
          <div
            className="pointer-events-none absolute inset-x-0 z-10 flex -translate-y-1/2 items-center gap-2 px-2"
            style={{ top: GAME.DANGER_LINE_Y }}
          >
            <div className="flex-1 border-t-2 border-dashed border-destructive/60" />
            <span className="text-xs text-destructive">{STRINGS.PLAY_DANGER_LINE}</span>
          </div>

          {/* 공격 알림 */}
          {notice && (
            <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center px-2">
              <Badge variant="destructive" className="h-7 animate-in max-w-full bg-card px-2 fade-in slide-in-from-top-2">
                {STRINGS.PLAY_ATTACK_NOTICE(notice.nickname, notice.count)}
              </Badge>
            </div>
          )}

          {!isGameOver && (
            <GameCanvas
              active={!isCounting}
              attack={notice}
              onScore={onScore}
              onNext={onNextLevel}
              onComboChange={onComboChange}
              onCombo={onCombo}
              onGameOver={onGameOver}
            />
          )}

          {!isGameOver && !isCounting && myScore === 0 && (
            <p className="pointer-events-none absolute inset-x-0 top-20 px-2 text-center text-sm text-muted-foreground">
              {STRINGS.PLAY_TAP_HINT}
            </p>
          )}

          {/* 콤보 진행 상황, 콤보가 끊겨 공격을 보냈을 때 안내 */}
          {!isGameOver && (sentAttack || combo >= COMBO.ATTACK_MIN_COMBO) && (
            <div className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center px-2">
              {sentAttack ? (
                <Badge key="sent" className="h-7 animate-in px-3 text-sm zoom-in-75 fade-in">
                  {STRINGS.PLAY_ATTACK_SENT(sentAttack.count)}
                </Badge>
              ) : (
                <Badge key={combo} variant="secondary" className="h-7 animate-in px-3 text-sm font-bold zoom-in-75">
                  {STRINGS.PLAY_COMBO(combo)}
                </Badge>
              )}
            </div>
          )}

          {/* 3-2-1 카운트다운 */}
          {isCounting && !isGameOver && (
            <CupOverlay>
              <span key={countdown} className="animate-in font-mono text-8xl font-bold text-primary zoom-in-50 fade-in">
                {countdown > 0 ? countdown : STRINGS.PLAY_COUNTDOWN_GO}
              </span>
            </CupOverlay>
          )}

          {/* 게임오버: 점수 확정 후 관전 */}
          {isGameOver && (
            <CupOverlay>
              <span className="text-3xl font-bold text-destructive">{STRINGS.PLAY_GAME_OVER}</span>
              <span className="text-sm text-muted-foreground">{STRINGS.PLAY_FINAL_SCORE}</span>
              <span className="font-mono text-5xl font-bold tabular-nums">{myScore}</span>
              <Badge variant="secondary">{STRINGS.PLAY_SPECTATING}</Badge>
              <span className="text-sm text-muted-foreground">{STRINGS.PLAY_SPECTATING_HINT}</span>
            </CupOverlay>
          )}
        </div>
        {/* 점수판 + 합체 점수표 (컵 오른쪽) */}
        <div className="flex min-h-0 w-28 shrink-0 flex-col gap-3 overflow-y-auto p-px">
          <Card size="sm">
            <CardContent className="flex flex-col gap-3">
              <span className="text-xs text-muted-foreground">{STRINGS.PLAY_SCOREBOARD}</span>
              {players.map((p, i) => (
                <ScoreBar
                  key={i}
                  nickname={p.nickname}
                  score={p.score ?? 0}
                  maxScore={maxScore}
                  isMe={p.nickname === myNickname}
                  isLoser={hasGap && (p.score ?? 0) === minScore}
                  isOut={p.alive === false}
                />
              ))}
            </CardContent>
          </Card>
          <MergeScoreTable />
        </div>
      </div>
    </div>
  );
}
