import { useState } from 'react'
import App from './App'
import ConfirmDialog from './ConfirmDialog'

export default function StartScreen() {
  const [showModal, setShowModal] = useState(!localStorage.getItem('confirmed'))
  const urlParams = new URLSearchParams(window.location.search)
  const ids = urlParams.get('ids')
  const playlist = urlParams.get('playlist') || 'default'
  const initialQuery =
    ids
      ?.split(',')
      .filter(f => !!f)
      .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
      .join('\n') || ''
  console.log({ initialQuery })
  return (
    <>
      {showModal ? (
        <ConfirmDialog open={showModal} setOpen={setShowModal} />
      ) : (
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
      )}
    </>
  )
}
