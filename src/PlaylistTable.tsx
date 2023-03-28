import { useEffect } from 'react'
import { format } from 'timeago.js'
import { Playlist } from './util'

export default function PlaylistTable({
  playlist,
  onPlay,
  playing,
  followPlaying,
}: {
  playlist: Playlist
  onPlay: (str: string) => void
  playing?: string
  followPlaying: boolean
}) {
  useEffect(() => {
    if (followPlaying) {
      // id starts with vid because id must start with alphachar
      document
        .querySelector(`#vid${playing}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [playing])
  return (
    <div className="playlist_table">
      <table>
        <thead>
          <tr>
            <th>np</th>
            <th>title</th>
            <th>channel</th>
            <th>published at</th>
            <th>play</th>
          </tr>
        </thead>
        <tbody>
          {playlist.map(item => (
            <tr key={item.id} id={`vid${item.videoId}`}>
              <td>{item.videoId === playing ? '>' : ''}</td>
              <td>{item.title}</td>
              <td>{item.channel}</td>
              <td>{format(item.publishedAt)}</td>
              <td>
                <button onClick={() => onPlay(item.videoId)}>Play</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
