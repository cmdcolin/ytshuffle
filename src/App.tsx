import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { myfetch, PreItem, PlaylistMap, Playlist, getIds, remap } from './util'
import localForage from 'localforage'
import PlaylistTable from './PlaylistTable'
import ConfirmDialog from './ConfirmDialog'
import ErrorMessage from './ErrorMessage'
import Filtering from './Filtering'
import Header from './Header'

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

const root =
  'https://39b5dlncof.execute-api.us-east-1.amazonaws.com/youtubeApiV3'
const start = 'https://www.youtube.com/watch?v=5Q5lry5g0ms'

export default function App2() {
  const [showModal, setShowModal] = useState(!localStorage.getItem('confirmed'))
  const urlParams = new URLSearchParams(window.location.search)
  const text = urlParams.get('ids')
  const maxResults = urlParams.get('max')
  return (
    <>
      <ConfirmDialog open={showModal} setOpen={setShowModal} />
      <App
        initialText={
          text
            ?.split(',')
            .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
            .join('\n') || start
        }
        initialMaxResults={maxResults || '50'}
        showPrivacyPolicy={() => setShowModal(true)}
      />
    </>
  )
}

function App({
  initialText,
  initialMaxResults,
  showPrivacyPolicy,
}: {
  initialText: string
  initialMaxResults: string
  showPrivacyPolicy: () => void
}) {
  const [query, setQuery] = useState(initialText)
  const [videoMap, setVideoMap] = useState<PlaylistMap>()
  const [filter, setFilter] = useState('')
  const [error, setError] = useState<unknown>()
  const [maxResults, setMaxResults] = useState(initialMaxResults)
  const [playing, setPlaying] = useState<string>()
  const [shuffle, setShuffle] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const preFiltered = videoMap ? Object.values(videoMap).flat() : undefined
  const counts = {} as Record<string, number>
  if (preFiltered) {
    for (const row of preFiltered) {
      if (!counts[row.channel]) {
        counts[row.channel] = 0
      }
      counts[row.channel]++
    }
  }
  const lcFilter = filter.toLowerCase()
  const playlist = preFiltered?.filter(
    f =>
      f.channel.toLowerCase().includes(lcFilter) ||
      f.title.toLowerCase().includes(lcFilter),
  )

  useEffect(() => {
    let controller = new AbortController()
    ;(async () => {
      try {
        setError(undefined)
        const videoIds = getIds(query)
        const items = Object.fromEntries(
          await Promise.all(
            videoIds.map(async id => {
              const key = id + '_' + maxResults
              let r1 = await localForage.getItem<Playlist>(key)
              if (!r1) {
                r1 = remap(
                  await myfetch<PreItem[]>(
                    `${root}?videoId=${id}&maxResults=${maxResults}`,
                    {
                      signal: controller.signal,
                    },
                  ),
                )
                await localForage.setItem(key, r1)
              }
              return [key, r1] as const
            }),
          ),
        )

        setVideoMap(items)
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setError(e)
        }
      }
    })()

    return () => controller.abort()
  }, [query, maxResults])

  function findIdx(playing: string) {
    return playlist?.findIndex(p => playing === p.videoId) || -1
  }

  function goToNext() {
    if (!playlist || !playing) {
      return
    }
    const next = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : Math.min(playlist.length, findIdx(playing)) + 1
    setPlaying(playlist[next].videoId)
  }

  function goToPrev() {
    if (!playlist || !playing) {
      return
    }
    const prev = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : Math.max(0, findIdx(playing)) - 1
    setPlaying(playlist[prev].videoId)
  }

  useEffect(() => {
    var url = new URL(window.location.href)
    url.searchParams.set('ids', getIds(query).join(','))
    url.searchParams.set('max', maxResults)
    window.history.replaceState({}, '', url)
  }, [query, maxResults])

  return (
    <div className="App">
      <h1>ytshuffle</h1>
      <div style={{ maxWidth: 600 }}>
        <label htmlFor="video">
          Enter a list of youtube videos separated by newlines, this page will
          then gather all the videos from the channels that uploaded these
          videos (I couldn't figure out how to fetch videos from the channel URL
          itself):
        </label>
        <div>
          <textarea
            cols={80}
            rows={10}
            id="video"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="maxres">Max results: </label>
        <input
          id="maxres"
          type="text"
          value={maxResults}
          onChange={event => setMaxResults(event.target.value)}
        />
      </div>

      {error ? <ErrorMessage error={error} /> : null}
      {playlist ? (
        <div>
          <div className="container">
            <Header
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
