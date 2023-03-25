import { useEffect, useState } from 'react'
import SavePlaylistModal from './SavePlaylistModal'
const mydef = {
  default: '',
  example: 'https://www.youtube.com/watch?v=3oJqulA8lQc',
}
export default function FormInputs({
  query,
  setQuery,
}: {
  query: string
  setQuery: (arg: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [currentPlaylist, setCurrentPlaylist] = useState('default')
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem('playlists') || JSON.stringify(mydef)),
  )

  useEffect(() => {
    setQuery(playlists[currentPlaylist] || '')
  }, [currentPlaylist])

  useEffect(() => {
    playlists[currentPlaylist] = query
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [query, playlists, currentPlaylist])

  const keys = Object.keys(playlists)
  return (
    <div>
      <div style={{ maxWidth: 600 }}>
        <div>
          <label htmlFor="video">
            Enter a list of youtube videos separated by newlines, this page will
            then gather all the videos from the channels that uploaded these
            videos (I couldn't figure out how to fetch videos from the channel
            URL itself):
          </label>
          <textarea
            cols={80}
            rows={5}
            id="video"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <div>
          <button onClick={() => setModalOpen(true)}>
            Save current playlist as...
          </button>
          <button onClick={() => setRenameModalOpen(true)}>
            Rename current playlist
          </button>
          <button
            onClick={() => {
              const { [currentPlaylist]: curr, ...rest } = playlists
              setPlaylists(rest)
              const next = Object.keys(rest)[0] || 'default'
              if (!rest[next]) {
                // just go back to defaults if nothing is there
                setPlaylists(mydef)
              }
              setCurrentPlaylist(next)
            }}
          >
            Delete current playlist
          </button>
        </div>
        <div>
          <label htmlFor="currplaylist">Current playlist: </label>
          <select
            id="currplaylist"
            value={currentPlaylist}
            onChange={event => setCurrentPlaylist(event.target.value)}
          >
            {(keys.length ? keys : ['No playlists saved yet']).map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
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
            const { [currentPlaylist]: curr, ...rest } = playlists
            setPlaylists({ ...rest, [name]: query })
            setCurrentPlaylist(name)
          }
          setRenameModalOpen(false)
        }}
      />
    </div>
  )
}
