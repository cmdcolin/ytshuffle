import { useState } from 'react'
import SavePlaylistModal from './SavePlaylistModal'
import { mydef } from './util'
import { StoreModel } from './store'
import { observer } from 'mobx-react'

export default observer(function PlaylistControls({
  model,
  playlists,
  setPlaylists,
}: {
  model: StoreModel
  playlists: Record<string, string>
  setPlaylists: (arg: Record<string, string>) => void
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
          const { [model.playlist]: current, ...rest } = playlists
          setPlaylists(rest)
          const next = Object.keys(rest)[0] || 'default'
          if (rest[next] === undefined) {
            // just go back to defaults if nothing is there
            setPlaylists(mydef)
          }
          model.setPlaylist(next)
        }}
      >
        Delete current playlist
      </button>
      <SavePlaylistModal
        open={modalOpen}
        currentPlaylist={model.playlist}
        onClose={name => {
          if (name) {
            setPlaylists({ ...playlists, [name]: model.query })
            model.setPlaylist(name)
          }
          setModalOpen(false)
        }}
      />
      <SavePlaylistModal
        open={renameModalOpen}
        currentPlaylist={model.playlist}
        onClose={name => {
          if (name) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [model.playlist]: current, ...rest } = playlists
            setPlaylists({ ...rest, [name]: model.query })
            model.setPlaylist(name)
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
            model.setQuery('')
            model.setPlaylist(name)
          }
          setNewModalOpen(false)
        }}
      />
    </div>
  )
})
