// matter.js 물리 엔진, 낙하, 머지, 점수, 게임오버 로직
// React와 네트워크를 모르는 순수 JavaScript 모듈
// createGame({ canvas, onScore, onNext, onGameOver }) 형태로 콜백만 받는다

import Matter from 'matter-js';
import { DRINKS, GAME } from '#game/constants.js';

const { Bodies, Body, Composite, Engine } = Matter;

// 낙하 확률(dropRate)에 따라 떨어뜨릴 음료 단계를 뽑는다
function pickDropLevel() {
  const droppable = DRINKS.filter((d) => d.dropRate > 0);
  let roll = Math.random() * droppable.reduce((sum, d) => sum + d.dropRate, 0);
  for (const drink of droppable) {
    roll -= drink.dropRate;
    if (roll <= 0) return drink.level;
  }
  return droppable[0].level;
}

// 단계 번호로 음료 정보를 찾는다
function getDrink(level) {
  return DRINKS.find((d) => d.level === level);
}

// 음료 반지름(px)을 구한다
function getRadius(level) {
  return GAME.BASE_RADIUS * getDrink(level).size;
}

// 게임 한 판을 만든다. 지금은 낙하·쌓임까지만 구현 (머지·점수·게임오버는 TODO)
export function createGame({ canvas, onNext }) {
  const ctx = canvas.getContext('2d');
  const engine = Engine.create();
  const styles = getComputedStyle(canvas);
  // 색은 index.css의 토큰(CSS 변수)에서 읽어온다
  const token = (name) => styles.getPropertyValue(`--${name}`).trim();
  const colors = Object.fromEntries(DRINKS.map((d) => [d.color, token(d.color)]));
  const textColor = token('background');
  const guideColor = token('border');

  let width = 0;
  let height = 0;
  let walls = [];
  let drinks = [];
  let heldLevel = pickDropLevel();
  let nextLevel = pickDropLevel();
  let aimX = null;
  let lastDropAt = -Infinity;
  let lastFrameAt = 0;
  let frameId = null;

  // 캔버스 크기에 맞춰 해상도와 벽(왼쪽·오른쪽·바닥)을 다시 만든다
  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const t = GAME.WALL_THICKNESS;
    Composite.remove(engine.world, walls);
    walls = [
      Bodies.rectangle(-t / 2, height / 2, t, height * 3, { isStatic: true }),
      Bodies.rectangle(width + t / 2, height / 2, t, height * 3, { isStatic: true }),
      Bodies.rectangle(width / 2, height + t / 2, width + t * 2, t, { isStatic: true }),
    ];
    Composite.add(engine.world, walls);
  }

  // 가로 위치가 컵 밖으로 나가지 않게 음료 반지름만큼 안쪽으로 맞춘다
  function clampX(x, radius) {
    return Math.min(Math.max(x, radius), Math.max(radius, width - radius));
  }

  // 지금 떨어뜨릴 수 있는지 확인한다 (연타 방지, 개수 상한)
  function canDrop() {
    return (
      performance.now() - lastDropAt >= GAME.DROP_COOLDOWN_MS &&
      drinks.length < GAME.MAX_DRINKS_IN_CUP
    );
  }

  // 음료 하나를 원과 글자로 그린다
  function drawDrink(level, x, y, alpha = 1) {
    const drink = getDrink(level);
    const radius = getRadius(level);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colors[drink.color];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (level >= GAME.LABEL_MIN_LEVEL) {
      ctx.fillStyle = textColor;
      ctx.font = `${GAME.LABEL_FONT_PX}px ${styles.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(drink.name, x, y, radius * 2 - 4);
    }
    ctx.globalAlpha = 1;
  }

  // 한 프레임을 그린다: 조준선, 손에 든 음료, 컵 안 음료
  function draw() {
    ctx.clearRect(0, 0, width, height);

    const radius = getRadius(heldLevel);
    const x = clampX(aimX ?? width / 2, radius);
    const y = radius + GAME.DROP_TOP_GAP;
    ctx.strokeStyle = guideColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, height);
    ctx.stroke();
    ctx.setLineDash([]);
    drawDrink(heldLevel, x, y, canDrop() ? 1 : 0.4);

    for (const body of drinks) {
      drawDrink(body.plugin.level, body.position.x, body.position.y);
    }
  }

  // 물리를 한 걸음 진행하고 다시 그린다
  function tick(now) {
    const delta = Math.min(now - lastFrameAt, GAME.MAX_FRAME_MS);
    lastFrameAt = now;
    Engine.update(engine, delta);
    draw();
    frameId = requestAnimationFrame(tick);
  }

  resize();

  return {
    // 게임 시작: 물리와 그리기 반복을 켠다
    start() {
      if (frameId !== null) return;
      lastFrameAt = performance.now();
      frameId = requestAnimationFrame(tick);
      onNext?.(nextLevel);
    },
    // 조준 위치 지정 (손에 든 음료와 조준선이 따라온다)
    aim(x) {
      aimX = x;
    },
    // 낙하 위치 지정: 손에 든 음료를 x 위치에서 떨어뜨린다
    drop(x) {
      aimX = x;
      if (!canDrop()) return false;

      const radius = getRadius(heldLevel);
      const body = Bodies.circle(clampX(x, radius), radius + GAME.DROP_TOP_GAP, radius, {
        restitution: GAME.RESTITUTION,
        friction: GAME.FRICTION,
        plugin: { level: heldLevel },
      });
      Body.setVelocity(body, { x: 0, y: 0 });
      Composite.add(engine.world, body);
      drinks.push(body);

      lastDropAt = performance.now();
      heldLevel = nextLevel;
      nextLevel = pickDropLevel();
      onNext?.(nextLevel);
      return true;
    },
    // 화면 크기가 바뀌었을 때 캔버스와 벽을 다시 맞춘다
    resize,
    // 게임 정리
    destroy() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      drinks = [];
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    },
  };
}
