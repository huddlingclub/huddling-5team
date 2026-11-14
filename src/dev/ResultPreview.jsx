import { useState } from 'react';
import { Button } from '#components/ui/button.jsx';
import ResultScreen from '#screens/ResultScreen.jsx';
import { STRINGS } from '#strings.js';

// 테스트용 가짜 결과 (실제 게임 점수가 아님). 순위는 승패 판정이 정해 보내는 모양과 같다
const SCENARIOS = {
  six: {
    label: STRINGS.DEV_RESULT_SIX,
    myNickname: '하은',
    coffeeLoser: '지훈',
    rankings: [
      { rank: 1, nickname: '민지', score: 12480 },
      { rank: 2, nickname: '준호', score: 10920 },
      { rank: 3, nickname: '서연', score: 9870 },
      { rank: 4, nickname: '도윤', score: 8450 },
      { rank: 5, nickname: '하은', score: 7300 },
      { rank: 6, nickname: '지훈', score: 5140 },
    ],
  },
  two: {
    label: STRINGS.DEV_RESULT_TWO,
    myNickname: '나야나',
    coffeeLoser: '나야나',
    rankings: [
      { rank: 1, nickname: '지민', score: 168 },
      { rank: 2, nickname: '나야나', score: 24 },
    ],
  },
  tie: {
    label: STRINGS.DEV_RESULT_TIE,
    myNickname: '서연',
    coffeeLoser: '커피마시고싶은날이다',
    rankings: [
      { rank: 1, nickname: '하늘', score: 201 },
      { rank: 2, nickname: '도윤', score: 175 },
      { rank: 3, nickname: '서연', score: 90 },
      { rank: 4, nickname: '커피마시고싶은날이다', score: 90 },
      { rank: 5, nickname: '지민', score: 90 },
    ],
  },
};

// 결과 화면만 띄워보는 테스트 페이지 (주소 뒤에 ?test=result)
export default function ResultPreview() {
  const [scenarioId, setScenarioId] = useState('six');
  const [notice, setNotice] = useState(null);
  const scenario = SCENARIOS[scenarioId];

  return (
    <>
      <div className="mx-auto flex w-full max-w-sm flex-wrap items-center gap-2 px-4 pt-4">
        {Object.entries(SCENARIOS).map(([id, item]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={id === scenarioId ? 'default' : 'outline'}
            onClick={() => {
              setScenarioId(id);
              setNotice(null);
            }}
          >
            {item.label}
          </Button>
        ))}
        {notice && (
          <p role="status" className="w-full text-sm text-muted-foreground">
            {notice}
          </p>
        )}
      </div>
      <ResultScreen
        rankings={scenario.rankings}
        coffeeLoser={scenario.coffeeLoser}
        myNickname={scenario.myNickname}
        onPlayAgain={() => setNotice(STRINGS.DEV_RESULT_PLAY_AGAIN_CLICKED)}
        onGoHome={() => setNotice(STRINGS.DEV_RESULT_GO_HOME_CLICKED)}
      />
    </>
  );
}
