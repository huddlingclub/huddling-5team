// 승패 판정: 최종 순위와 커피 담당을 정한다 (React와 네트워크를 모르는 순수 함수)
// players: [{ nickname, score, maxLevel, alive, gameOverAt }]

// 커피 담당 후보 둘을 비교한다. 앞사람이 더 "담당에 가까우면" 음수
function compareLoser(a, b) {
  // 1) 점수가 낮은 사람
  if (a.score !== b.score) return a.score - b.score;
  // 2) 먼저 게임오버된 사람 (끝까지 살아남으면 가장 늦은 것으로 본다)
  const aOverAt = a.gameOverAt ?? Infinity;
  const bOverAt = b.gameOverAt ?? Infinity;
  if (aOverAt !== bOverAt) return aOverAt - bOverAt;
  // 3) 최고 단계 음료가 낮은 사람
  return (a.maxLevel ?? 0) - (b.maxLevel ?? 0);
}

// 순위표와 커피 담당 닉네임을 돌려준다
export function judge(players) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const rankings = sorted.map((p, i) => ({ rank: i + 1, nickname: p.nickname, score: p.score }));

  const byLoser = [...players].sort(compareLoser);
  // 4) 끝까지 같으면 그중 한 명을 무작위로 고른다
  const tied = byLoser.filter((p) => compareLoser(p, byLoser[0]) === 0);
  const loser = tied[Math.floor(Math.random() * tied.length)];

  return { rankings, coffeeLoser: loser?.nickname ?? null };
}
