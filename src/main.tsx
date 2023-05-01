import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import StartScreen from './startscreen/StartScreen'
import './index.css'

const rootElement = document.querySelector('#root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootElement!)

root.render(<StartScreen />)
