import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PlayPreview from './dev/PlayPreview.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'

// 주소 뒤에 ?test=play 를 붙이면 홈 대신 플레이 화면 테스트 페이지를 띄운다
const isPlayTest = new URLSearchParams(window.location.search).get('test') === 'play'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      {isPlayTest ? <PlayPreview /> : <App />}
    </ThemeProvider>
  </StrictMode>,
)
