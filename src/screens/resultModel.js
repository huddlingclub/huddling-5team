// 결과 화면용 데이터. 화면은 이 모듈의 결과만 그린다.
export const MOCK_RESULT = {
  date: '2026-11-14',
  players: [
    { name: '민지', score: 12480, finished: true },
    { name: '준호', score: 10920, finished: true },
    { name: '서연', score: 9870, finished: true },
    { name: '도윤', score: 8450, finished: true },
    { name: '하은', score: 7300, finished: true },
    { name: '지훈', score: 5140, finished: true },
  ],
};

export function formatScore(score) {
  return Number(score).toLocaleString('ko-KR');
}

export function toResultView(result) {
  const finished = (result?.players ?? []).filter((player) => player.finished !== false);
  const ranked = [...finished].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ko'),
  );
  const lowestScore = ranked.length ? ranked[ranked.length - 1].score : null;
  const tiedForLast = ranked.filter((player) => player.score === lowestScore);
  const [, month = 0, day = 0] = (result?.date ?? '').split('-').map(Number);

  return {
    month,
    day,
    participantCount: ranked.length,
    treatCount: Math.max(ranked.length - 1, 0),
    loser: tiedForLast[tiedForLast.length - 1] ?? null,
    rows: ranked.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      score: player.score,
      isLoser: player.score === lowestScore,
    })),
  };
}
