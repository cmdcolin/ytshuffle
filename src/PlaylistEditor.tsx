import { useEffect, useState } from 'react'
import PlaylistControls from './PlaylistControls'
import { mydef } from './util'

export default function PlaylistEditor({
  query,
  currentPlaylist,
  setQuery,
  setCurrentPlaylist,
}: {
  query: string
  currentPlaylist: string
  setQuery: (arg: string) => void
  setCurrentPlaylist: (arg: string) => void
}) {
  const ret = JSON.parse(
    localStorage.getItem('playlists') || JSON.stringify(mydef),
  )
  // we add default back if there is none because it gets
  // confused on visiting with blank urlparams otherwise
  const [playlists, setPlaylists] = useState({ default: '', ...ret })

  useEffect(() => {
    setQuery(playlists[currentPlaylist] || '')
  }, [currentPlaylist])

  useEffect(() => {
    playlists[currentPlaylist] = query
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [query, playlists, currentPlaylist])

  const keys = Object.keys(playlists).sort()
  return (
    <div className="playlist_editor">
      <div>
        <div>
          <label htmlFor="video">
            Enter a list of youtube videos separated by newlines, this page will
            then gather all the videos from the channels that uploaded these
            videos (I couldn't figure out how to fetch videos from the channel
            URL itself):
          </label>
        </div>
        <div>
          <textarea
            cols={70}
            rows={5}
            id="video"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <PlaylistControls
          query={query}
          playlists={playlists}
          currentPlaylist={currentPlaylist}
          setPlaylists={setPlaylists}
          setCurrentPlaylist={setCurrentPlaylist}
          setQuery={setQuery}
        />

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
    </div>
  )
}
