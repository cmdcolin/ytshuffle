import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { getvideoid, myfetch, PreItem, Item, PlaylistMap } from './util'
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

const root =
  'https://39b5dlncof.execute-api.us-east-1.amazonaws.com/youtubeApiV3'
const start = 'https://www.youtube.com/watch?v=5Q5lry5g0ms'

export default function App2() {
  const urlParams = new URLSearchParams(window.location.search)
  const text = urlParams.get('ids')
  const maxResults = urlParams.get('max')
  return (
    <App
      initialText={
        text
          ?.split(',')
          .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
          .join('\n') || start
      }
      initialMaxResults={maxResults || '50'}
    />
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
}: {
  initialText: string
  initialMaxResults: string
}) {
  const [text, setText] = useState(initialText)
  const [videoMap, setVideoMap] = useState<PlaylistMap>()
  const [filter, setFilter] = useState('')
  const [error, setError] = useState<unknown>()
  const [maxResults, setMaxResults] = useState(initialMaxResults)
  const [playing, setPlaying] = useState<string>()
  const [shuffle, setShuffle] = useState(true)
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
        const videoIds = text
          .split('\n')
          .map(f => f.trim())
          .filter((f): f is string => !!f)
          .map(f => getvideoid(f))
          .filter((f): f is string => !!f)
        const map = JSON.parse(
          (await localForage.getItem('map')) || '{}',
        ) as PlaylistMap
        console.log({ map })
        const items = Object.fromEntries(
          await Promise.all(
            videoIds.map(async id => {
              const key = id + '_' + maxResults
              return [
                key,
                map?.[key] ||
                  remap(
                    await myfetch<PreItem[]>(
                      `${root}?videoId=${id}&maxResults=${maxResults}`,
                      {
                        signal: controller.signal,
                      },
                    ),
                  ),
              ] as const
            }),
          ),
        )

        localForage.setItem('map', JSON.stringify(items))
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
    const ids = text
      .split('\n')
      .map(f => f.trim())
      .filter(f => !!f)
      .map(f => getvideoid(f))
    var url = new URL(window.location.href)
    url.searchParams.set('ids', ids.join(','))
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
                  onEnd={() => goToNext()}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : !error ? (
        'Loading...'
      ) : null}
      <a href="https://github.com/cmdcolin/ytshuffle">Github</a>
    </div>
  )
}
