import { useEffect, useState } from 'react';
import { Button } from '#components/ui/button.jsx';
import PlayScreen from '#screens/PlayScreen.jsx';
import { ROOM } from '#game/constants.js';
import { STRINGS } from '#strings.js';

// 테스트용 가짜 값 (실제 게임 숫자가 아님)
const MY_NICKNAME = '나야나';
const OTHER_NICKNAMES = ['지민', '하늘', '도윤', '서연'];
const COUNTDOWN_FROM = 3;
const TICK_MS = 1000;
const NOTICE_MS = 1500;
const MY_SCORE_STEP = 5;
const OTHER_SCORE_MAX_STEP = 8;
const ATTACK_COUNTS = [1, 2, 3];

// 0점인 가짜 상대 목록을 만든다
function createOthers() {
  return OTHER_NICKNAMES.map((nickname) => ({ nickname, score: 0, alive: true }));
}

// 배열에서 하나를 무작위로 고른다
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 홈·대기실 없이 플레이 화면만 띄워보는 테스트 페이지 (주소 뒤에 ?test=play)
export default function PlayPreview() {
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);
  const [timeLeft, setTimeLeft] = useState(ROOM.DEFAULT_DURATION_SEC);
  const [others, setOthers] = useState(createOthers);
  const [myScore, setMyScore] = useState(0);
  const [nextLevel, setNextLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [notice, setNotice] = useState(null);
  // 다시 시작할 때 게임판을 새로 만들기 위한 판 번호
  const [round, setRound] = useState(0);

  const isCounting = countdown !== null;
  const isFinished = timeLeft <= 0;

  // 3-2-1-GO 카운트다운을 1초마다 줄인다
  useEffect(() => {
    if (!isCounting) return undefined;
    const id = setTimeout(() => setCountdown(countdown > 0 ? countdown - 1 : null), TICK_MS);
    return () => clearTimeout(id);
  }, [countdown, isCounting]);

  // 남은 시간을 줄이고 상대 점수를 무작위로 올린다
  useEffect(() => {
    if (isCounting || isFinished) return undefined;
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
      setOthers((list) =>
        list.map((p) =>
          p.alive ? { ...p, score: p.score + Math.floor(Math.random() * OTHER_SCORE_MAX_STEP) } : p,
        ),
      );
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isCounting, isFinished]);

  // 공격 알림을 잠깐 보여주고 지운다
  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(null), NOTICE_MS);
    return () => clearTimeout(id);
  }, [notice]);

  // 내 점수를 올린다
  function handleAddScore() {
    setMyScore((s) => s + MY_SCORE_STEP);
  }

  // 상대가 장애물을 보낸 것처럼 알림을 띄운다
  function handleAttack() {
    setNotice({ nickname: pickRandom(OTHER_NICKNAMES), count: pickRandom(ATTACK_COUNTS) });
  }

  // 처음 상태로 되돌려 카운트다운부터 다시 시작한다
  function handleRestart() {
    setCountdown(COUNTDOWN_FROM);
    setTimeLeft(ROOM.DEFAULT_DURATION_SEC);
    setOthers(createOthers());
    setMyScore(0);
    setNextLevel(1);
    setIsGameOver(false);
    setNotice(null);
    setRound((r) => r + 1);
  }

  const players = [{ nickname: MY_NICKNAME, score: myScore, alive: !isGameOver }, ...others];
  const canPlay = !isCounting && !isGameOver && !isFinished;

  return (
    <div className="relative mx-auto max-w-sm">
      <PlayScreen
        key={round}
        players={players}
        timeLeft={timeLeft}
        durationSec={ROOM.DEFAULT_DURATION_SEC}
        myNickname={MY_NICKNAME}
        myScore={myScore}
        isGameOver={isGameOver}
        countdown={countdown}
        nextLevel={nextLevel}
        notice={notice}
        onScore={setMyScore}
        onNextLevel={setNextLevel}
        onGameOver={() => setIsGameOver(true)}
      />

      {/* 테스트 조작 버튼 (점수판 아래 빈자리) */}
      <div className="absolute right-4 bottom-4 flex w-28 flex-col gap-2">
        <span className="text-xs text-muted-foreground">{STRINGS.DEV_TITLE}</span>
        <Button size="sm" disabled={!canPlay} onClick={handleAddScore}>
          {STRINGS.DEV_ADD_SCORE}
        </Button>
        <Button size="sm" variant="outline" disabled={!canPlay} onClick={handleAttack}>
          {STRINGS.DEV_ATTACK}
        </Button>
        <Button size="sm" variant="destructive" disabled={!canPlay} onClick={() => setIsGameOver(true)}>
          {STRINGS.DEV_GAME_OVER}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleRestart}>
          {STRINGS.DEV_RESTART}
        </Button>
      </div>
    </div>
  );
}
