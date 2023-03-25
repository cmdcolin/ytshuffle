import { useState } from 'react'
import App from './App'
import ConfirmDialog from './ConfirmDialog'

const start = 'https://www.youtube.com/watch?v=5Q5lry5g0ms'

export default function StartScreen() {
  const [showModal, setShowModal] = useState(!localStorage.getItem('confirmed'))
  const urlParams = new URLSearchParams(window.location.search)
  const text = urlParams.get('ids')
  return (
    <>
      <ConfirmDialog open={showModal} setOpen={setShowModal} />
      <App
        initialText={
          text
            ?.split(',')
            .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
            .join('\n') || start
        }
        showPrivacyPolicy={() => setShowModal(true)}
      />
    </>
  )
}
