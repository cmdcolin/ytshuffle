import { useEffect, useState } from 'react'

export default function SavePlaylistModal({
  open,
  currentPlaylist,
  onClose,
}: {
  open: boolean
  currentPlaylist: string
  onClose: (arg?: string) => void
}) {
  const [name, setName] = useState(currentPlaylist)
  useEffect(() => {
    setName(currentPlaylist)
  }, [currentPlaylist])
  return (
    <dialog onClose={() => onClose()} open={open}>
      <div>
        <label htmlFor="playlist">Playlist name: </label>
        <input
          id="playlist"
          type="text"
          value={name}
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
