import React from 'react'
import { format } from 'timeago.js'
import { Playlist } from './util'

export default function PlaylistTable({
  playlist,
  onPlay,
  playing,
}: {
  playlist: Playlist
  onPlay: (str: string) => void
  playing?: string
}) {
  return (
    <div style={{ overflow: 'auto' }}>
      <table className="fixed_header">
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
          {playlist.map(item => {
            return (
              <tr key={item.id}>
                <td>{item.videoId === playing ? '>' : ''}</td>
                <td>{item.title}</td>
                <td>{item.channel}</td>
                <td>{format(item.publishedAt)}</td>
                <td>
                  <button onClick={() => onPlay(item.videoId)}>Play</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
