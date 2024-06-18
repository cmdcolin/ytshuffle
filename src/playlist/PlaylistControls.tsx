import { useState } from 'react'
import SavePlaylistModal from './SavePlaylistModal'
import { observer } from 'mobx-react'

// locals
import { mydef } from '../util'
import { StoreModel } from '../store'

const PlaylistControls = observer(function ({ model }: { model: StoreModel }) {
  const [saveAsModalOpen, setSaveAsModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [newModalOpen, setNewModalOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setSaveAsModalOpen(true)}>
        Save current playlist as...
      </button>
      <button onClick={() => setRenameModalOpen(true)}>
        Rename current playlist
      </button>
      <button onClick={() => setNewModalOpen(true)}>New playlist</button>
      <button
        onClick={() => {
          const { playlist, playlists } = model

          const { [playlist]: current, ...rest } = playlists.toJSON()
          model.setPlaylists(rest)
          const next = Object.keys(rest)[0] || 'default'
          if (rest[next] === undefined) {
            // just go back to defaults if nothing is there
            model.setPlaylists(mydef)
          }
          model.setPlaylist(next)
        }}
      >
        Delete current playlist
      </button>
      <SavePlaylistModal
        open={saveAsModalOpen}
        currentPlaylist={model.playlist}
        onClose={name => {
          if (name) {
            const { playlists, query } = model
            model.setPlaylists({ ...playlists.toJSON(), [name]: query })
            model.setPlaylist(name)
          }
          setSaveAsModalOpen(false)
        }}
      />
      <SavePlaylistModal
        open={renameModalOpen}
        currentPlaylist={model.playlist}
        onClose={name => {
          if (name) {
            const { query, playlist, playlists } = model

            const { [playlist]: current, ...rest } = playlists.toJSON()
            model.setPlaylists({ ...rest, [name]: query })
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
            const { playlists } = model
            model.setPlaylists({ ...playlists.toJSON(), [name]: '' })
            model.setQuery('')
            model.setPlaylist(name)
          }
          setNewModalOpen(false)
        }}
      />
    </div>
  )
})
export default PlaylistControls
