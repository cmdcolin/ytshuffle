import { useState } from 'react'
import SavePlaylistModal from './SavePlaylistModal'
import { mydef } from './util'

export default function PlaylistControls({
  currentPlaylist,
  playlists,
  query,
  setCurrentPlaylist,
  setPlaylists,
  setQuery,
}: {
  query: string
  currentPlaylist: string
  playlists: Record<string, string>
  setCurrentPlaylist: (arg: string) => void
  setPlaylists: (arg: Record<string, string>) => void
  setQuery: (arg: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [newModalOpen, setNewModalOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setModalOpen(true)}>
        Save current playlist as...
      </button>
      <button onClick={() => setRenameModalOpen(true)}>
        Rename current playlist
      </button>
      <button onClick={() => setNewModalOpen(true)}>New playlist</button>
      <button
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [currentPlaylist]: current, ...rest } = playlists
          setPlaylists(rest)
          const next = Object.keys(rest)[0] || 'default'
          if (rest[next] === undefined) {
            // just go back to defaults if nothing is there
            setPlaylists(mydef)
          }
          setCurrentPlaylist(next)
        }}
      >
        Delete current playlist
      </button>
      <SavePlaylistModal
        open={modalOpen}
        currentPlaylist={currentPlaylist}
        onClose={name => {
          if (name) {
            setPlaylists({ ...playlists, [name]: query })
            setCurrentPlaylist(name)
          }
          setModalOpen(false)
        }}
      />
      <SavePlaylistModal
        open={renameModalOpen}
        currentPlaylist={currentPlaylist}
        onClose={name => {
          if (name) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [currentPlaylist]: current, ...rest } = playlists
            setPlaylists({ ...rest, [name]: query })
            setCurrentPlaylist(name)
          }
          setRenameModalOpen(false)
        }}
      />
      <SavePlaylistModal
        open={newModalOpen}
        currentPlaylist={''}
        onClose={name => {
          if (name) {
            setPlaylists({ ...playlists, [name]: '' })
            setQuery('')
            setCurrentPlaylist(name)
          }
          setNewModalOpen(false)
        }}
      />
    </div>
  )
}
