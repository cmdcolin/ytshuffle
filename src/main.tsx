import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import StartScreen from './components/StartScreen'
import './index.css'

const rootElement = document.querySelector('#root')

const root = createRoot(rootElement!)

root.render(
  <StrictMode>
    <StartScreen />
  </StrictMode>,
)
