import { useState } from 'react'
import SavePlaylistModal from './SavePlaylistDialog'
import { observer } from 'mobx-react'

// locals
import { mydef } from './util'
import type { StoreModel } from './store'
import Button from './Button'

const PlaylistControls = observer(function ({ model }: { model: StoreModel }) {
  const [saveAsModalOpen, setSaveAsModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [newModalOpen, setNewModalOpen] = useState(false)
  return (
    <div>
      <Button
        onClick={() => {
          setSaveAsModalOpen(true)
        }}
      >
        Save current playlist as...
      </Button>
      <Button
        onClick={() => {
          setRenameModalOpen(true)
        }}
      >
        Rename current playlist
      </Button>
      <Button
        onClick={() => {
          setNewModalOpen(true)
        }}
      >
        New playlist
      </Button>
      <Button
        onClick={() => {
          const { playlist, playlists } = model

          const { [playlist]: current, ...rest } = playlists.toJSON()
          model.setPlaylists(rest)
          const next = Object.keys(rest)[0] || 'default'
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (rest[next] === undefined) {
            // just go back to defaults if nothing is there
            model.setPlaylists(mydef)
          }
          model.setPlaylist(next)
        }}
      >
        Delete current playlist
      </Button>
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
