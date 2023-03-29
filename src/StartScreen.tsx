import { useState } from 'react'
import App from './App'
import ConfirmDialog from './ConfirmDialog'

export default function StartScreen() {
  const [showModal, setShowModal] = useState(!localStorage.getItem('confirmed'))
  const urlParameters = new URLSearchParams(window.location.search)
  const ids = urlParameters.get('ids')
  const playlist = urlParameters.get('playlist') || 'default'

  return (
    <>
      <ConfirmDialog open={showModal} setOpen={setShowModal} />
      <App
        initialQuery={
          ids
            ?.split(',')
            .filter(f => !!f)
            .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
            .join('\n') || ''
        }
        initialPlaylist={playlist}
        showPrivacyPolicy={() => setShowModal(true)}
      />
    </>
  )
}
