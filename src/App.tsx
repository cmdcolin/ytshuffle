import { useEffect, useState } from 'react'
import YouTube from 'react-youtube'

// @ts-expect-error
import logo from './favicon.svg'
console.log({ logo })

// locals
import PlaylistTable from './PlaylistTable'
import ErrorMessage from './ErrorMessage'
import PlaylistList from './PlaylistList'
import PlayerControls from './PlayerControls'
import PlaylistEditor from './PlaylistEditor'
import Footer from './Footer'

// hooks
import useFetch from './useFetch'
import usePlayerControls from './usePlayerControls'
import useUrlParams from './useUrlParams'
import usePlaylists from './usePlaylists'

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

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

                <PlayerControls
                  currentPlaylist={currentPlaylist}
                  goToNext={goToNext}
                  goToPrev={goToPrev}
                  autoplay={autoplay}
                  shuffle={shuffle}
                  playlists={playlists}
                  setQuery={setQuery}
                  setCurrentPlaylist={setCurrentPlaylist}
                  setPlaying={setPlaying}
                  setShuffle={setShuffle}
                  setAutoplay={setAutoplay}
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
            <div className="player_panel">
              <div>
                <label htmlFor="filter">Filter/search table: </label>
                <input
                  id="filter"
                  type="text"
                  value={filter}
                  onChange={event => setFilter(event.target.value)}
                />
                <button onClick={() => setFilter('')}>Clear filter</button>
              </div>
              <div className="container">
                <PlaylistTable
                  playlist={playlist}
                  playing={playing}
                  onPlay={videoId => setPlaying(videoId)}
                />
                <div>
                  {playing ? (
                    <YouTube
                      videoId={playing}
                      opts={opts}
                      onEnd={() => {
                        if (autoplay) {
                          goToNext()
                        }
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : !error ? (
          'Loading...'
        ) : null}
      </div>
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
    </>
  )
}
