import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { getvideoid, myfetch } from './util'

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

interface Item {
  id: string
  snippet: {
    videoOwnerChannelTitle: string
    resourceId: { videoId: string }
    title: string
  }
}

type Playlist = Item[]

function ResultsTable({
  playlist,
  onPlay,
  playing,
}: {
  playlist: Playlist
  onPlay: (str: string) => void
  playing?: string
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>np</th>
          <th>title</th>
          <th>channel</th>
          <th>play</th>
        </tr>
      </thead>
      <tbody>
        {playlist.map(item => {
          return (
            <tr key={item.id}>
              <td>{item.snippet.resourceId.videoId === playing ? '>' : ''}</td>
              <td>{item.snippet.title}</td>
              <td>{item.snippet.videoOwnerChannelTitle}</td>
              <td>
                <button onClick={() => onPlay(item.snippet.resourceId.videoId)}>
                  Play
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
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

function App({
  initialText,
  initialMaxResults,
}: {
  initialText: string
  initialMaxResults: string
}) {
  const [text, setText] = useState(initialText)
  const [playlist, setPlaylist] = useState<Playlist>()
  const [error, setError] = useState<unknown>()
  const [maxResults, setMaxResults] = useState(initialMaxResults)
  const [playing, setPlaying] = useState<string>()
  const [shuffle, setShuffle] = useState(true)

  useEffect(() => {
    let controller = new AbortController()
    ;(async () => {
      try {
        setError(undefined)
        const items = await Promise.all(
          text
            .split('\n')
            .map(f => f.trim())
            .filter(f => !!f)
            .map(f => getvideoid(f))
            .map(id =>
              myfetch(`${root}?videoId=${id}&maxResults=${maxResults}`, {
                signal: controller.signal,
              }),
            ),
        )
        setPlaylist(items.flat())
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setError(e)
        }
      }
    })()

    return () => controller.abort()
  }, [text, maxResults])

  function goToNext() {
    if (!playlist) {
      return
    }
    const next = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : Math.min(
          playlist.length,
          playlist.findIndex(p => playing === p.snippet.resourceId.videoId),
        ) + 1
    setPlaying(playlist[next].snippet.resourceId.videoId)
  }

  function goToPrev() {
    if (!playlist) {
      return
    }
    const prev = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : Math.max(
          0,
          playlist.findIndex(p => playing === p.snippet.resourceId.videoId),
        ) - 1
    setPlaying(playlist[prev].snippet.resourceId.videoId)
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
      <div style={{ display: 'block' }}>
        <label htmlFor="video">
          Enter a list of youtube videos, will gather "Max results" videos from
          channels associated with these videos:
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
      <div style={{ display: 'block' }}>
        <label htmlFor="maxResults">Max results: </label>
        <input
          id="maxResults"
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
            <label htmlFor="shuffle">Shuffle?</label>
            <input
              id="shuffle"
              type="checkbox"
              checked={shuffle}
              onChange={event => setShuffle(event.target.checked)}
            />
          </div>
          <div style={{ margin: 20, display: 'flex', maxHeight: 800 }}>
            <div style={{ overflow: 'auto' }}>
              <div>
                <ResultsTable
                  playlist={playlist}
                  playing={playing}
                  onPlay={videoId => setPlaying(videoId)}
                />
              </div>
            </div>
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
      ) : (
        'Loading...'
      )}
      <a href="https://github.com/cmdcolin/ytshuffle">Github</a>
    </div>
  )
}
