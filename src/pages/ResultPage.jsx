import ResultScreen from '#screens/ResultScreen.jsx';
import { MOCK_RESULT } from '#screens/resultModel.js';

export const RESULT_PATH = '/result';

export function isResultPath(pathname = window.location.pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === RESULT_PATH;
}

// 결과 플로우와 /result 주소가 같이 쓰는 페이지
export default function ResultPage({ result = MOCK_RESULT, onGoHome }) {
  return <ResultScreen result={result} onGoHome={onGoHome} />;
}
