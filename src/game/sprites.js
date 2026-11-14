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
