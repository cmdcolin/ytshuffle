import { useEffect, useState } from 'react'
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
  const [filter, setFilter] = useState('')
  const [shuffle, setShuffle] = useState(true)
  const [followPlaying, setFollowPlaying] = useState(true)
  const [currentPlaylist, setCurrentPlaylist] = useState(initialPlaylist)
  const [autoplay, setAutoplay] = useState(true)
  const [videoMap, error, currentlyProcessing] = useFetch(query)

  const {
    playlist,
    channelToId,
    counts,
    goToNext,
    goToPrev,
    setPlaying,
    playing,
  } = usePlayerControls(videoMap, filter, shuffle)

  useUrlParameters(query, currentPlaylist)

  useEffect(() => {
    setQuery(playlists[currentPlaylist] || '')
  }, [currentPlaylist])

  const [playlists, setPlaylists] = usePlaylists(query, currentPlaylist)

  return (
    <>
      <Header />
      <div className="App">
        {error ? <ErrorMessage error={error} /> : null}
        {playlist ? (
          <>
            <div className="playlist_header">
              <PlaylistEditor
                query={query}
                playlists={playlists}
                currentPlaylist={currentPlaylist}
                setQuery={setQuery}
                setPlaylists={setPlaylists}
                setCurrentPlaylist={setCurrentPlaylist}
              />
              <PlaylistList
                setFilter={setFilter}
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
              playing={playing}
              followPlaying={followPlaying}
              setFollowPlaying={setFollowPlaying}
              currentPlaylist={currentPlaylist}
              filter={filter}
              playlists={playlists}
              shuffle={shuffle}
              autoplay={autoplay}
              goToNext={goToNext}
              goToPrev={goToPrev}
              setQuery={setQuery}
              setFilter={setFilter}
              setCurrentPlaylist={setCurrentPlaylist}
              setShuffle={setShuffle}
              setAutoplay={setAutoplay}
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
