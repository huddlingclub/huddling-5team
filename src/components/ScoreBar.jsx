// 참가자별 실시간 점수 바 컴포넌트
export default function ScoreBar({ nickname, score, maxScore, isMe, isLoser }) {
  const width = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${isMe ? 'font-bold' : ''}`}>
      <span className="w-16 truncate text-sm">{nickname}</span>
      <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
        <div
          className={`h-full rounded-md transition-all duration-300 ${
            isLoser ? 'bg-destructive' : 'bg-primary'
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm font-mono">{score}</span>
    </div>
  );
}
