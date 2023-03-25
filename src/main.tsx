import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import StartScreen from './StartScreen'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

root.render(
  <StrictMode>
    <StartScreen />
  </StrictMode>,
)
