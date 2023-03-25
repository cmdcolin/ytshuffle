import { useState } from 'react'
import App from './App'
import ConfirmDialog from './ConfirmDialog'

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
            .filter(f => !!f)
            .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
            .join('\n') || ''
        }
        showPrivacyPolicy={() => setShowModal(true)}
      />
    </>
  )
}
