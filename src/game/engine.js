// matter.js 물리 엔진, 낙하, 머지, 점수, 게임오버 로직
// React와 네트워크를 모르는 순수 JavaScript 모듈
// createGame({ onScore, onCombo, onGameOver }) 형태로 콜백만 받는다

export function createGame({ canvas, onScore, onGameOver }) {
  // TODO: matter.js 엔진 초기화, 게임 로직 구현
  return {
    // 게임 시작
    start() {},
    // 낙하 위치 지정
    drop(x) {},
    // 게임 정리
    destroy() {},
  };
}
