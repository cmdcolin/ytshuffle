import { useState } from 'react'
import YouTube from 'react-youtube'

// locals
import PlaylistTable from './PlaylistTable'
import ErrorMessage from './ErrorMessage'
import Filtering from './Filtering'
import PlayerControls from './PlayerControls'
import FormInputs from './FormInputs'
import Footer from './Footer'

// hooks
import useFetch from './useFetch'
import usePlayerControls from './usePlayerControls'
import useUrlParams from './useUrlParams'

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

export default function App({
  initialText,
  initialPlaylist,
  showPrivacyPolicy,
}: {
  initialText: string
  initialPlaylist: string
  showPrivacyPolicy: () => void
}) {
  const [query, setQuery] = useState(initialText)
  const [filter, setFilter] = useState('')
  const [shuffle, setShuffle] = useState(true)
  const [currentPlaylist, setCurrentPlaylist] = useState(initialPlaylist)
  const [autoplay, setAutoplay] = useState(true)
  const [videoMap, error, currentlyProcessing] = useFetch(query)

  const { playlist, counts, goToNext, goToPrev, setPlaying, playing } =
    usePlayerControls(videoMap, filter, shuffle)

  useUrlParams(query, currentPlaylist)

  return (
    <>
      <div className="App">
        <h1>ytshuffle</h1>

        {error ? <ErrorMessage error={error} /> : null}
        {playlist ? (
          <div>
            <div>
              <FormInputs
                query={query}
                setQuery={setQuery}
                currentPlaylist={currentPlaylist}
                setCurrentPlaylist={setCurrentPlaylist}
              />
              <PlayerControls
                setPlaying={setPlaying}
                goToNext={goToNext}
                goToPrev={goToPrev}
                setQuery={setQuery}
                autoplay={autoplay}
                shuffle={shuffle}
                setShuffle={setShuffle}
                setAutoplay={setAutoplay}
              />
              <Filtering
                filter={filter}
                setFilter={setFilter}
                counts={counts}
              />
            </div>
            <div>
              {currentlyProcessing ? (
                <div>Currently processing: {currentlyProcessing}</div>
              ) : null}
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
        ) : !error ? (
          'Loading...'
        ) : null}
      </div>
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
    </>
  )
}
