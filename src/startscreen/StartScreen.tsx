import { useState } from 'react'
import App from '../app/App'
import ConfirmDialog from './ConfirmDialog'

const s = (l: string) => decodeURIComponent(l)

export default function StartScreen() {
  const [showModal, setShowModal] = useState(!localStorage.getItem('confirmed'))
  const urlParameters = new URLSearchParams(window.location.search)
  const ids = s(urlParameters.get('ids') || '')
    .split(',')
    .filter(f => !!f)
    .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
    .join('\n')
  const playlist = s(urlParameters.get('playlist') || 'default')

  return (
    <>
      <ConfirmDialog open={showModal} setOpen={setShowModal} />
      <App
        initialQuery={ids}
        initialPlaylist={playlist}
        showPrivacyPolicy={() => setShowModal(true)}
      />
    </>
  )
}
