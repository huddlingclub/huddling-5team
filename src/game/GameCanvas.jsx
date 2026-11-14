import { useEffect, useRef } from 'react';
import { createGame } from '#game/engine.js';
import { OBSTACLE } from '#game/constants.js';

// engine.js를 화면의 canvas에 붙이는 컴포넌트
export default function GameCanvas({
  active = true,
  attack = null,
  scheduledDrops = 0,
  onScore,
  onNext,
  onComboChange,
  onCombo,
  onGameOver,
}) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const deliveredDrops = useRef(0);
  // 엔진을 다시 만들지 않고도 최신 콜백을 부르기 위한 보관함
  const callbacksRef = useRef({ onScore, onNext, onComboChange, onCombo, onGameOver });

  useEffect(() => {
    callbacksRef.current = { onScore, onNext, onComboChange, onCombo, onGameOver };
  });

  // 엔진을 만들고 시작한다. 화면에서 사라질 때 정리한다
  useEffect(() => {
    const canvas = canvasRef.current;
    const game = createGame({
      canvas,
      onScore: (...args) => callbacksRef.current.onScore?.(...args),
      onNext: (...args) => callbacksRef.current.onNext?.(...args),
      onComboChange: (...args) => callbacksRef.current.onComboChange?.(...args),
      onCombo: (...args) => callbacksRef.current.onCombo?.(...args),
      onGameOver: (...args) => callbacksRef.current.onGameOver?.(...args),
    });
    gameRef.current = game;
    deliveredDrops.current = 0;
    game.start();

    const observer = new ResizeObserver(() => game.resize());
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  // 새 공격({ count })을 받으면 그 수만큼 장애물을 떨어뜨린다
  useEffect(() => {
    if (attack) gameRef.current?.addObstacles(attack.count);
  }, [attack]);

  // 탭을 다시 열어 여러 시점을 건너뛴 경우에도 같은 회차를 두 번 투하하지 않는다.
  useEffect(() => {
    const due = scheduledDrops - deliveredDrops.current;
    if (active && due > 0) {
      gameRef.current.addObstacles(due, OBSTACLE.EVENT_DROP_COUNT);
      deliveredDrops.current = scheduledDrops;
    }
  }, [active, scheduledDrops]);

  // 포인터의 화면 좌표를 캔버스 안 가로 위치로 바꾼다
  function toCanvasX(event) {
    return event.clientX - canvasRef.current.getBoundingClientRect().left;
  }

  // 누르거나 움직이는 동안 조준 위치를 옮긴다
  function handleAim(event) {
    if (active) gameRef.current?.aim(toCanvasX(event));
  }

  // 손을 떼면 그 위치에서 음료를 떨어뜨린다
  function handleDrop(event) {
    if (active) gameRef.current?.drop(toCanvasX(event));
  }

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full touch-none"
      onPointerDown={handleAim}
      onPointerMove={handleAim}
      onPointerUp={handleDrop}
    />
  );
}
