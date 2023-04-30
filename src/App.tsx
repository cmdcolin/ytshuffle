import { useState, useEffect } from 'react'
// locals
import ErrorMessage from './ErrorMessage'
import PlaylistList from './PlaylistList'
import PlaylistEditor from './PlaylistEditor'
import Footer from './Footer'
import PlayerPanel from './PlayerPanel'
import Header from './Header'

// hooks
import useFetch from './useFetch'
import usePlayerControls from './usePlayerControls'
import useUrlParameters from './useUrlParameters'
import usePlaylists from './usePlaylists'
import createStore from './store'

export default function App({
  initialQuery,
  initialPlaylist,
  showPrivacyPolicy,
}: {
  initialQuery: string
  initialPlaylist: string
  showPrivacyPolicy: () => void
}) {
  const [query, setQuery] = useState(initialQuery)
  const model = createStore().create({
    query: initialQuery,
    playlist: initialPlaylist,
  })
  const [videoMap, error, currentlyProcessing] = useFetch(query)

  const {
    playlist,
    channelToId,
    counts,
    playing,
    goToNext,
    goToPrev,
    setPlaying,
  } = usePlayerControls(videoMap, model.filter, model.shuffle)

  useUrlParameters(query, model.playlist)

  useEffect(() => {
    setQuery(playlists[model.playlist] || '')
  }, [model.playlist])

  const [playlists, setPlaylists] = usePlaylists(query, model.playlist)

  return (
    <>
      <Header />
      <div className="App">
        {error ? <ErrorMessage error={error} /> : null}
        {playlist ? (
          <>
            <div className="playlist_header">
              <PlaylistEditor
                model={model}
                playlists={playlists}
                setPlaylists={setPlaylists}
              />
              <PlaylistList
                model={model}
                counts={counts}
                channelToId={channelToId}
              />
            </div>

            <div>
              {currentlyProcessing ? (
                <div>Currently processing: {currentlyProcessing}</div>
              ) : null}
            </div>
            <PlayerPanel
              model={model}
              playing={playing}
              playlists={playlists}
              goToNext={goToNext}
              goToPrev={goToPrev}
              setPlaying={setPlaying}
              playlist={playlist}
            />
          </>
        ) : null}
      </div>
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
    </>
  )
}
