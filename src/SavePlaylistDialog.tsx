import { useEffect, useState } from 'react'

import BaseDialog from './BaseDialog'
import Button from './Button'

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
    <BaseDialog open={open} onClose={onClose}>
      <form
        onSubmit={event => {
          event.preventDefault()
          onClose(name)
        }}
      >
        <div>
          <label htmlFor="playlist">Playlist name: </label>
          <input
            id="playlist"
            type="text"
            className="input input-sm"
            value={name}
            onChange={event => {
              setName(event.target.value)
            }}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
          <Button
            onClick={() => {
              onClose()
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </BaseDialog>
  )
}
