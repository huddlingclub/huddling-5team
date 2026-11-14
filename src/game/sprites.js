// 음료 단계별 픽셀 그림 정보
// 원본 목록은 docs/design-assets/approved-assets.json, 실행용 사본은 public/assets/drinks/
import approved from '../../docs/design-assets/approved-assets.json';

// 단계 → { url: 그림 주소, size: 그림 한 변(px), bounds: 투명 여백을 뺀 실제 그림 범위 [왼쪽, 위, 오른쪽, 아래] }
export const DRINK_SPRITES = Object.fromEntries(
  approved.assets.map((asset) => [
    asset.level,
    { url: `/assets/${asset.file}`, size: asset.width, bounds: asset.contentBounds },
  ]),
);

// 플레이 화면 뒤에 까는 카페 배경 그림 (화면 폭에 따라 골라 쓴다)
// 게임판 테두리 그림(/assets/ui/board-frame.png)은 src/index.css의 board-frame에서 쓴다
export const PLAY_BACKGROUNDS = {
  // 기본 (일반 폰)
  mobile: '/assets/backgrounds/cafe-mobile.png',
  // 폭이 좁은 폰
  mobileSmall: { url: '/assets/backgrounds/cafe-mobile-small.png', media: '(max-width: 359px)' },
  // 태블릿·PC
  desktop: { url: '/assets/backgrounds/cafe-desktop.png', media: '(min-width: 768px)' },
};

// 장애물(초콜릿 판) 픽셀 그림. 가로:세로 = 2:1
export const OBSTACLE_SPRITE = '/assets/obstacles/chocolate.png';
