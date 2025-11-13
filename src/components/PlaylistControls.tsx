import { Suspense, lazy, useState } from 'react'

import { observer } from 'mobx-react-lite'

import ButtonM1 from './ButtonM1'
import PlaylistSelector from './PlaylistSelector'
import { mydef } from '../util'

import type { StoreModel } from '../store'

// lazies
const SavePlaylistModal = lazy(() => import('./SavePlaylistDialog'))

const PlaylistControls = observer(function ({ model }: { model: StoreModel }) {
  const [saveAsModalOpen, setSaveAsModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [newModalOpen, setNewModalOpen] = useState(false)
  return (
    <div>
      <ButtonM1
        onClick={() => {
          setSaveAsModalOpen(true)
        }}
      >
        Save current playlist as...
      </ButtonM1>
      <ButtonM1
        onClick={() => {
          setRenameModalOpen(true)
        }}
      >
        Rename current playlist
      </ButtonM1>
      <ButtonM1
        onClick={() => {
          setNewModalOpen(true)
        }}
      >
        New playlist
      </ButtonM1>
      <ButtonM1
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
      </ButtonM1>
      <PlaylistSelector model={model} />
      {saveAsModalOpen ? (
        <Suspense fallback={null}>
          <SavePlaylistModal
            open
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
        </Suspense>
      ) : null}
      {renameModalOpen ? (
        <Suspense fallback={null}>
          <SavePlaylistModal
            open
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
        </Suspense>
      ) : null}
      {newModalOpen ? (
        <Suspense fallback={null}>
          <SavePlaylistModal
            open
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
        </Suspense>
      ) : null}
    </div>
  )
})
export default PlaylistControls
