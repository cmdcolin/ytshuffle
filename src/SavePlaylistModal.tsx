import { useState } from 'react'

export default function SavePlaylistModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: (arg?: string) => void
}) {
  const [name, setName] = useState('playlistName')
  return (
    <dialog onClose={() => onClose()} open={open}>
      <div>
        <label htmlFor="playlist">Playlist name: </label>
        <input
          id="playlist"
          type="text"
          onChange={event => setName(event.target.value)}
        />
      </div>
      <div>
        <button onClick={() => onClose(name)}>Submit</button>
        <button onClick={() => onClose()}>Cancel</button>
      </div>
    </dialog>
  )
}
