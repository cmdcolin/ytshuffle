import { useState } from 'react'
import YouTube from 'react-youtube'
import localForage from 'localforage'

// locals
import PlaylistTable from './PlaylistTable'
import ErrorMessage from './ErrorMessage'
import Filtering from './Filtering'
import PlayerControls from './PlayerControls'
import FormInputs from './FormInputs'
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
  showPrivacyPolicy,
}: {
  initialText: string
  showPrivacyPolicy: () => void
}) {
  const [query, setQuery] = useState(initialText)
  const [filter, setFilter] = useState('')
  const [shuffle, setShuffle] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const [videoMap, error, currentlyProcessing] = useFetch(query)

  const { playlist, counts, goToNext, goToPrev, setPlaying, playing } =
    usePlayerControls(videoMap, filter, shuffle)

  useUrlParams(query)

  return (
    <div className="App">
      <h1>ytshuffle</h1>

      {error ? <ErrorMessage error={error} /> : null}
      {playlist ? (
        <div>
          <div>
            <FormInputs query={query} setQuery={setQuery} />
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
            <Filtering filter={filter} setFilter={setFilter} counts={counts} />
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
      <a href="https://github.com/cmdcolin/ytshuffle">Github</a>
      <p>
        Note: this app caches data to avoid repeatedly fetching data from
        youtube, but will new uploads from channels. Click here to clear this
        cache and get e.g. the latest videos from the channel{' '}
        <button
          onClick={() => {
            localForage.clear()
            window.location.reload()
          }}
        >
          Clear cache
        </button>
      </p>
      <button onClick={() => showPrivacyPolicy()}>Show privacy policy</button>
    </div>
  )
}
