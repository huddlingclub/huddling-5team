import { useEffect, useRef } from 'react';

// engine.js를 화면의 canvas에 붙이는 컴포넌트
export default function GameCanvas({ onScore, onGameOver }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // TODO: createGame으로 엔진 초기화, cleanup에서 destroy
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg border border-border"
    />
  );
}
