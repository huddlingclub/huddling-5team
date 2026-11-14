import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PlayPreview from './dev/PlayPreview.jsx'
import ResultPreview from './dev/ResultPreview.jsx'

// 주소 뒤에 ?test=play 또는 ?test=result 를 붙이면 홈 대신 해당 화면 테스트 페이지를 띄운다
const TEST_PAGES = { play: PlayPreview, result: ResultPreview }
const Page = TEST_PAGES[new URLSearchParams(window.location.search).get('test')] ?? App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
