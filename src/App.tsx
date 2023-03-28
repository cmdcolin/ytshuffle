import { useEffect, useState } from 'react'

// @ts-expect-error
import logo from './favicon.svg'

// locals
import ErrorMessage from './ErrorMessage'
import PlaylistList from './PlaylistList'
import PlaylistEditor from './PlaylistEditor'
import Footer from './Footer'

// hooks
import useFetch from './useFetch'
import usePlayerControls from './usePlayerControls'
import useUrlParams from './useUrlParams'
import usePlaylists from './usePlaylists'
import PlayerPanel from './PlayerPanel'

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

  useUrlParams(query, currentPlaylist)

  useEffect(() => {
    setQuery(playlists[currentPlaylist] || '')
  }, [currentPlaylist])

  const [playlists, setPlaylists] = usePlaylists(query, currentPlaylist)

  return (
    <>
      <div className="App">
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <img height={40} src={logo} />
          <h1 style={{ margin: 0, marginLeft: 10 }}>{'  '}ytshuffle</h1>
        </div>

        {error ? <ErrorMessage error={error} /> : null}
        {playlist ? (
          <div>
            <div className="playlist_header">
              <div>
                <PlaylistEditor
                  query={query}
                  playlists={playlists}
                  currentPlaylist={currentPlaylist}
                  setQuery={setQuery}
                  setPlaylists={setPlaylists}
                  setCurrentPlaylist={setCurrentPlaylist}
                />
              </div>
              <div>
                <PlaylistList
                  setFilter={setFilter}
                  counts={counts}
                  channelToId={channelToId}
                />
              </div>
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
          </div>
        ) : !error ? (
          'Loading...'
        ) : null}
      </div>
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
    </>
  )
}
