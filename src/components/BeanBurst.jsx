import { useEffect, useRef } from 'react';
import beanUrl from '../../docs/design-assets/drinks/bean.png';

const BURST_DELAY_MS = 150;
const DURATION_MS = 2000;
const GRAVITY = 1700;
const SIZES = [16, 24, 32];
const TONE_TOKENS = ['--espresso', '--bean', '--americano'];

function tokenColor(name) {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

// 원두 이미지를 크기·갈색 톤별로 미리 그려 둔다. 픽셀이 뭉개지지 않게 보간을 끈다.
function makeSprites(image) {
  return SIZES.flatMap((size) =>
    TONE_TOKENS.map((token) => {
      const sprite = document.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const ctx = sprite.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, size, size);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = tokenColor(token);
      ctx.fillRect(0, 0, size, size);
      return sprite;
    }),
  );
}

// 좌·우에서 안쪽·위쪽으로 터지게 한다. fromLeft면 왼쪽, 아니면 오른쪽에서 출발.
function makeBeans(count, width, midY) {
  return Array.from({ length: count }, (_, i) => {
    const fromLeft = i % 2 === 0;
    const speed = 480 + Math.random() * 620;
    const up = -0.55 - Math.random() * 0.7;
    const inward = (0.45 + Math.random() * 0.55) * (fromLeft ? 1 : -1);
    const length = Math.hypot(inward, up);
    return {
      x: fromLeft ? -24 : width + 24,
      y: midY + (Math.random() - 0.5) * 80,
      vx: (inward / length) * speed,
      vy: (up / length) * speed,
      spin: (Math.random() - 0.5) * 14,
      rotation: Math.random() * Math.PI * 2,
      sprite: Math.floor(Math.random() * SIZES.length * TONE_TOKENS.length),
    };
  });
}

// 화면 좌우에서 원두가 폭죽처럼 터졌다가 중력으로 떨어진다. 클릭은 막지 않는다.
export default function BeanBurst({ originRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const origin = originRef.current;
    if (!canvas || !origin) return undefined;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const count = 40 + Math.floor(Math.random() * 21);
    let beans = [];

    let frame = 0;
    let startAt = 0;
    const image = new Image();
    image.src = beanUrl;

    function draw(now) {
      const elapsed = now - startAt;
      ctx.clearRect(0, 0, width, height);
      if (elapsed >= DURATION_MS) return;
      ctx.imageSmoothingEnabled = false;
      const t = elapsed / 1000;
      const alpha = elapsed < 1600 ? 1 : 1 - (elapsed - 1600) / 400;
      ctx.globalAlpha = alpha;
      beans.forEach((bean) => {
        const x = bean.x + bean.vx * t;
        const y = bean.y + bean.vy * t + 0.5 * GRAVITY * t * t;
        const sprite = sprites[bean.sprite];
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(bean.rotation + bean.spin * t);
        ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
        ctx.restore();
      });
      frame = requestAnimationFrame(draw);
    }

    let sprites = [];
    function arm() {
      const rect = origin.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      beans = makeBeans(count, width, midY);
      sprites = makeSprites(image);
      frame = requestAnimationFrame((now) => {
        startAt = now;
        draw(now);
      });
    }

    const timer = window.setTimeout(() => {
      if (image.complete) arm();
      else image.onload = arm;
    }, BURST_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      image.onload = null;
    };
  }, [originRef]);

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
  );
}
