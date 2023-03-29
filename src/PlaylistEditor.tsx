import { useEffect, useState } from 'react'
import PlaylistControls from './PlaylistControls'

export default function PlaylistEditor({
  query,
  currentPlaylist,
  playlists,
  setPlaylists,
  setQuery,
  setCurrentPlaylist,
}: {
  query: string
  currentPlaylist: string
  playlists: Record<string, string>
  setPlaylists: (arg: Record<string, string>) => void
  setQuery: (arg: string) => void
  setCurrentPlaylist: (arg: string) => void
}) {
  const [hide, setHide] = useState(
    JSON.parse(localStorage.getItem('hide_form') || 'false') as boolean,
  )

  useEffect(() => {
    localStorage.setItem('hide_form', JSON.stringify(hide))
  }, [hide])

  return (
    <div>
      <button onClick={() => setHide(s => !s)}>
        {hide ? 'Show form' : 'Hide form'}
      </button>
      {hide ? null : (
        <div className="playlist_editor">
          <div className="text_header">Enter list of youtube videos</div>
          <div>
            <div>
              <label htmlFor="video">
                Enter a list of youtube videos separated by newlines, this page
                will then gather all the videos from the channels that uploaded
                these videos (I couldn't figure out how to fetch videos from the
                channel URL itself):
              </label>
            </div>
            <div>
              <textarea
                cols={70}
                rows={5}
                style={{ maxWidth: '100%' }}
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
          </div>
        </div>
      )}
    </div>
  )
}
