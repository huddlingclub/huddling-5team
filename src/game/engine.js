// matter.js 물리 엔진, 낙하, 머지, 점수, 게임오버 로직
// React와 네트워크를 모르는 순수 JavaScript 모듈
// createGame({ canvas, onScore, onNext, onGameOver }) 형태로 콜백만 받는다

import Matter from 'matter-js';
import { COMBO, DRINKS, GAME, OBSTACLE, UNICORN_BONUS } from '#game/constants.js';

const { Bodies, Composite, Engine, Events } = Matter;

// 가장 높은 음료 단계 (이 단계끼리 만나면 둘 다 사라진다)
const MAX_LEVEL = Math.max(...DRINKS.map((d) => d.level));

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

// 콤보 수로 상대에게 보낼 장애물 수를 구한다 (콤보 − 1, 상한 있음)
export function getAttackCount(combo) {
  if (combo < COMBO.ATTACK_MIN_COMBO) return 0;
  return Math.min(combo - 1, COMBO.MAX_OBSTACLES_PER_ATTACK);
}

// 게임 한 판을 만든다. 낙하·쌓임·머지·점수까지 구현 (콤보·장애물·게임오버까지 구현
// onComboChange(count): 콤보 수가 바뀔 때마다, onCombo(count): 2콤보 이상이 끊긴 순간 한 번
export function createGame({ canvas, onScore, onNext, onComboChange, onCombo, onGameOver }) {
  const ctx = canvas.getContext('2d');
  const engine = Engine.create();
  const styles = getComputedStyle(canvas);
  // 색은 index.css의 토큰(CSS 변수)에서 읽어온다
  const token = (name) => styles.getPropertyValue(`--${name}`).trim();
  const colors = Object.fromEntries(DRINKS.map((d) => [d.color, token(d.color)]));
  const textColor = token('background');
  const guideColor = token('border');
  const obstacleColor = token('foreground');
  // 장애물(초콜릿 판) 크기
  const obstacleWidth = getRadius(OBSTACLE.WIDTH_LEVEL) * 2;
  const obstacleHeight = obstacleWidth * OBSTACLE.THICKNESS_RATIO;

  let width = 0;
  let height = 0;
  let walls = [];
  let drinks = [];
  let mergeQueue = [];
  let obstacles = [];
  let pendingObstacles = 0;
  let combo = 0;
  let lastMergeAt = 0;
  let nextObstacleAt = 0;
  let score = 0;
  let maxLevel = 0;
  let elapsedMs = 0;
  let isOver = false;
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

  // 음료 하나를 물리 세계에 넣는다
  function addDrink(level, x, y) {
    const radius = getRadius(level);
    const body = Bodies.circle(x, y, radius, {
      restitution: GAME.RESTITUTION,
      friction: GAME.FRICTION,
      plugin: { level, merged: false, dangerSince: null },
    });
    Composite.add(engine.world, body);
    drinks.push(body);
    maxLevel = Math.max(maxLevel, level);
    return body;
  }

  // 장애물(초콜릿 판) 하나를 컵 위쪽 무작위 가로 위치에 떨어뜨린다
  function spawnObstacle() {
    const half = obstacleWidth / 2;
    const x = half + Math.random() * Math.max(0, width - obstacleWidth);
    const body = Bodies.rectangle(x, obstacleHeight / 2 + GAME.DROP_TOP_GAP, obstacleWidth, obstacleHeight, {
      restitution: GAME.RESTITUTION,
      friction: GAME.FRICTION,
      chamfer: { radius: OBSTACLE.CORNER_RADIUS },
      plugin: { obstacle: true, dangerSince: null },
    });
    Composite.add(engine.world, body);
    obstacles.push(body);
  }

  // 받을 장애물이 남아 있으면 간격을 두고 하나씩 떨어뜨린다
  function dropPendingObstacles() {
    if (pendingObstacles === 0 || elapsedMs < nextObstacleAt) return;
    spawnObstacle();
    pendingObstacles -= 1;
    nextObstacleAt = elapsedMs + OBSTACLE.DROP_GAP_MS;
  }

  // 합체가 일어난 자리 근처(가장자리에서 일정 거리 안)의 장애물을 모두 지운다
  function clearObstaclesNear(x, y) {
    const near = obstacles.filter((body) => {
      // 합체 지점을 장애물 기준 좌표로 돌려서 가장자리까지 거리를 잰다
      const dx = x - body.position.x;
      const dy = y - body.position.y;
      const cos = Math.cos(-body.angle);
      const sin = Math.sin(-body.angle);
      const localX = Math.abs(dx * cos - dy * sin) - obstacleWidth / 2;
      const localY = Math.abs(dx * sin + dy * cos) - obstacleHeight / 2;
      return Math.hypot(Math.max(localX, 0), Math.max(localY, 0)) <= OBSTACLE.CLEAR_RADIUS_PX;
    });
    if (near.length === 0) return;
    Composite.remove(engine.world, near);
    obstacles = obstacles.filter((body) => !near.includes(body));
  }

  // 닿은 두 물체가 같은 단계 음료면 합칠 목록에 올린다
  function queueMerges(event) {
    for (const { bodyA, bodyB } of event.pairs) {
      const a = bodyA.plugin;
      const b = bodyB.plugin;
      if (a.level === undefined || a.level !== b.level || a.merged || b.merged) continue;
      a.merged = true;
      b.merged = true;
      mergeQueue.push([bodyA, bodyB]);
    }
  }

  // 목록에 올린 음료 쌍을 합친다: 둘을 지우고 가운데에 다음 단계 음료를 만든다
  function applyMerges() {
    if (mergeQueue.length === 0) return;
    for (const [a, b] of mergeQueue) {
      Composite.remove(engine.world, [a, b]);
      drinks = drinks.filter((body) => body !== a && body !== b);

      combo += 1;
      lastMergeAt = elapsedMs;
      const level = a.plugin.level;
      const x = (a.position.x + b.position.x) / 2;
      const y = (a.position.y + b.position.y) / 2;
      clearObstaclesNear(x, y);
      if (level >= MAX_LEVEL) {
        // 최종 단계끼리 만나면 둘 다 사라지고 보너스 점수
        score += UNICORN_BONUS;
      } else {
        addDrink(level + 1, clampX(x, getRadius(level + 1)), y);
        score += getDrink(level + 1).mergeScore;
      }
    }
    mergeQueue = [];
    onScore?.(score, maxLevel);
    onComboChange?.(combo);
  }

  // 마지막 합체 뒤 일정 시간이 지나면 콤보를 끊고, 공격 조건이면 알린다
  function checkComboEnd() {
    if (combo === 0 || elapsedMs - lastMergeAt < COMBO.WINDOW_MS) return;
    const finalCombo = combo;
    combo = 0;
    onComboChange?.(0);
    if (finalCombo >= COMBO.ATTACK_MIN_COMBO) onCombo?.(finalCombo);
  }

  Events.on(engine, 'collisionStart', queueMerges);
  Events.on(engine, 'collisionActive', queueMerges);

  // 경고선 위에 일정 시간 넘게 머문 음료·장애물이 있는지 확인한다
  function checkDanger() {
    for (const body of [...drinks, ...obstacles]) {
      const isAbove = body.bounds.min.y < GAME.DANGER_LINE_Y;
      if (!isAbove) {
        body.plugin.dangerSince = null;
      } else if (body.plugin.dangerSince === null) {
        body.plugin.dangerSince = elapsedMs;
      } else if (elapsedMs - body.plugin.dangerSince >= GAME.DANGER_TIMEOUT_MS) {
        return true;
      }
    }
    return false;
  }

  // 지금 떨어뜨릴 수 있는지 확인한다 (게임오버, 연타 방지, 개수 상한)
  function canDrop() {
    return (
      !isOver &&
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

  // 장애물 하나를 납작한 초콜릿 판으로 그린다
  function drawObstacle(body) {
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    ctx.fillStyle = obstacleColor;
    ctx.beginPath();
    ctx.roundRect(-obstacleWidth / 2, -obstacleHeight / 2, obstacleWidth, obstacleHeight, OBSTACLE.CORNER_RADIUS);
    ctx.fill();
    // 초콜릿 칸을 나누는 홈
    ctx.strokeStyle = textColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const offset of [-obstacleWidth / 6, obstacleWidth / 6]) {
      ctx.moveTo(offset, -obstacleHeight / 2);
      ctx.lineTo(offset, obstacleHeight / 2);
    }
    ctx.stroke();
    ctx.restore();
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
    for (const body of obstacles) {
      drawObstacle(body);
    }
  }

  // 물리를 한 걸음 진행하고 다시 그린다
  function tick(now) {
    const delta = Math.min(now - lastFrameAt, GAME.MAX_FRAME_MS);
    lastFrameAt = now;
    elapsedMs += delta;
    dropPendingObstacles();
    Engine.update(engine, delta);
    applyMerges();
    checkComboEnd();
    draw();
    if (checkDanger()) {
      // 게임오버: 반복을 멈추고 그 시점 점수로 확정한다
      isOver = true;
      frameId = null;
      onGameOver?.(score, maxLevel);
      return;
    }
    frameId = requestAnimationFrame(tick);
  }

  resize();

  return {
    // 게임 시작: 물리와 그리기 반복을 켠다
    start() {
      if (frameId !== null || isOver) return;
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
      addDrink(heldLevel, clampX(x, radius), radius + GAME.DROP_TOP_GAP);

      lastDropAt = performance.now();
      heldLevel = nextLevel;
      nextLevel = pickDropLevel();
      onNext?.(nextLevel);
      return true;
    },
    // 장애물 n개를 받는다. 컵 상한을 넘치는 만큼은 버린다
    addObstacles(n) {
      if (isOver) return;
      const room = OBSTACLE.MAX_IN_CUP - obstacles.length - pendingObstacles;
      const count = Math.max(0, Math.min(n, room));
      if (count === 0) return;
      if (pendingObstacles === 0) nextObstacleAt = elapsedMs;
      pendingObstacles += count;
    },
    // 화면 크기가 바뀌었을 때 캔버스와 벽을 다시 맞춘다
    resize,
    // 게임 정리
    destroy() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      drinks = [];
      mergeQueue = [];
      obstacles = [];
      pendingObstacles = 0;
      Events.off(engine);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    },
  };
}
