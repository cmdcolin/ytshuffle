import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import { shuffle } from './util'

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
}

async function myfetch(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${response.status} ${response.statusText}`)
  }
  return response.json()
}

function getvideoid(url: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match?.[2].length == 11) {
    return match[2]
  } else {
    return undefined
  }
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

interface Playlist {
  items: Item[]
}

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
          <th>playing</th>
          <th>title</th>
          <th>channel</th>
          <th>play</th>
        </tr>
      </thead>
      <tbody>
        {playlist.items.map(item => {
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
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const text = urlParams.get('ids')
  const r =
    text
      ?.split(',')
      .map(videoId => `https://www.youtube.com/watch?v=${videoId}`)
      .join('\n') || start
  console.log({ r })
  return <App initialText={r} />
}

function App({ initialText }: { initialText: string }) {
  const [text, setText] = useState(initialText)
  const [playlist, setPlaylist] = useState<Playlist>()
  const [error, setError] = useState<unknown>()
  const [maxResults, setMaxResults] = useState('50')
  const [playing, setPlaying] = useState<string>()

  useEffect(() => {
    ;(async () => {
      try {
        setError(undefined)
        const items = await Promise.all(
          text
            .split('\n')
            .map(f => f.trim())
            .filter(f => !!f)
            .map(f => getvideoid(f))
            .map(async id => {
              const res = await myfetch(
                `${root}?videoId=${id}&maxResults=${maxResults}`,
              )
              return res.items
            }),
        )
        setPlaylist({ items: items.flat() })
      } catch (e) {
        console.error(e)
        setError(e)
      }
    })()
  }, [text, maxResults])

  function goToNext() {
    if (!playlist) {
      return
    }
    setPlaying(
      playlist.items[
        Math.max(
          0,
          playlist.items.findIndex(
            p => playing === p.snippet.resourceId.videoId,
          ),
        ) - 1
      ].snippet.resourceId.videoId,
    )
  }

  function goToPrev() {
    if (!playlist) {
      return
    }
    setPlaying(
      playlist.items[
        Math.max(
          0,
          playlist.items.findIndex(
            p => playing === p.snippet.resourceId.videoId,
          ),
        ) - 1
      ].snippet.resourceId.videoId,
    )
  }

  function shufflePlaylist() {
    if (!playlist) {
      return
    }
    setPlaylist({ ...playlist, items: shuffle(playlist.items) })
  }

  useEffect(() => {
    const ids = text
      .split('\n')
      .map(f => f.trim())
      .filter(f => !!f)
      .map(f => getvideoid(f))
    var url = new URL(window.location.href)
    url.searchParams.set('ids', ids.join(','))
    window.history.replaceState({}, '', url)
  }, [text])

  return (
    <div className="App">
      <h1>ytshuffle</h1>
      <div style={{ display: 'block' }}>
        <label htmlFor="video">
          Enter a list of youtube videos, will gather ALL videos from channels
          associated with these videos:
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
            <button onClick={() => shufflePlaylist()}>Shuffle</button>
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
    </div>
  )
}
