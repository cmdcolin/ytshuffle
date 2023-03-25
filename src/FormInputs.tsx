import { useEffect, useState } from 'react'
import SavePlaylistModal from './SavePlaylistModal'

export default function FormInputs({
  query,
  setQuery,
}: {
  query: string
  setQuery: (arg: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem('playlists') || '{}'),
  )

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [playlists])
  const keys = Object.keys(playlists)
  return (
    <div>
      <div style={{ maxWidth: 600 }}>
        <label htmlFor="video">
          Enter a list of youtube videos separated by newlines, this page will
          then gather all the videos from the channels that uploaded these
          videos (I couldn't figure out how to fetch videos from the channel URL
          itself):
        </label>
        <textarea
          cols={80}
          rows={5}
          id="video"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button onClick={() => setModalOpen(true)}>
          Save current playlist
        </button>
        <select onChange={event => setQuery(playlists[event.target.value])}>
          {(keys.length ? keys : ['No playlists saved yet']).map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <SavePlaylistModal
        open={modalOpen}
        onClose={name => {
          if (name) {
            setPlaylists({ ...playlists, [name]: query })
          }
          setModalOpen(false)
        }}
      />
    </div>
  )
}
