import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import {
  getvideoid,
  myfetch,
  PreItem,
  Item,
  PlaylistMap,
  Playlist,
} from './util'
import localForage from 'localforage'
import PlaylistTable from './PlaylistTable'

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

function ErrorMessage({ error }: { error: unknown }) {
  return <div style={{ color: 'red' }}>{`${error}`}</div>
}

function getIds(text: string) {
  return text
    .split('\n')
    .map(f => f.trim())
    .filter((f): f is string => !!f)
    .map(f => getvideoid(f))
    .filter((f): f is string => !!f)
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
      <dialog open={showModal} style={{ maxWidth: 500 }}>
        <p>
          By using this website you agree to usage of the "Privacy Policy" below
        </p>
        <p>
          This website (the "app") uses an "API Client" to access the Youtube
          Data API. This app does not collect any data related to your usage.
          The app allows third parties to serve content, including
          advertisements just by virtue of Youtube doing so. See also{' '}
          <a href="https://www.youtube.com/t/terms">
            YouTube's Terms of Service
          </a>{' '}
          and{' '}
          <a href="http://www.google.com/policies/privacy">
            Google's privacy policy
          </a>
          .
        </p>
        <p>
          I added this consent screen because Google asks users of their API to
          do so{' '}
          <a href="https://developers.google.com/youtube/terms/developer-policies">
            here
          </a>
          . If there are any concerns, you can e-mail{' '}
          <a href="mailto:colin.diesh@gmail.com">me</a>.
        </p>

        <button
          onClick={() => {
            localStorage.setItem('confirmed', 'true')
            setShowModal(false)
          }}
        >
          accept
        </button>
      </dialog>
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

function remap(items: PreItem[]): Item[] {
  return items.map(item => ({
    id: item.id,
    channel: item.snippet.videoOwnerChannelTitle,
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
  }))
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
  const [text, setText] = useState(initialText)
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
        const videoIds = getIds(text)
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
  }, [text, maxResults])

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
    url.searchParams.set('ids', getIds(text).join(','))
    url.searchParams.set('max', maxResults)
    window.history.replaceState({}, '', url)
  }, [text, maxResults])

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
            value={text}
            onChange={event => setText(event.target.value)}
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
          <div>
            <button onClick={() => setText('')}>Clear</button>
            <button onClick={() => setPlaying(undefined)}>Stop</button>
            <button onClick={() => goToNext()}>Next</button>
            <button onClick={() => goToPrev()}>Prev</button>
            <label htmlFor="shuffle">Shuffle? </label>
            <input
              id="shuffle"
              type="checkbox"
              checked={shuffle}
              onChange={event => setShuffle(event.target.checked)}
            />
            <label htmlFor="autoplay">Autoplay? </label>
            <input
              id="autoplay"
              type="checkbox"
              checked={autoplay}
              onChange={event => setAutoplay(event.target.checked)}
            />
          </div>
          <div>
            Channels loaded (click button to filter particular channel):{' '}
            {Object.entries(counts).map(([key, value]) => (
              <button key={key} onClick={() => setFilter(key)}>
                {key} ({value || 0})
              </button>
            ))}
            <button onClick={() => setFilter('')}>All</button>
          </div>
          <div>
            <label htmlFor="filter">Filter/search table: </label>
            <input
              id="filter"
              type="text"
              value={filter}
              onChange={event => setFilter(event.target.value)}
            />
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
