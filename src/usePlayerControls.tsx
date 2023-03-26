import { useState } from 'react'
import { PlaylistMap } from './util'

function clamp(p: number, min: number, max: number) {
  return Math.max(min, Math.min(max, p))
}

export default function usePlayerControls(
  videoMap: PlaylistMap | undefined,
  filter: string,
  shuffle: boolean,
) {
  const [playing, setPlaying] = useState<string>()
  const preFiltered = videoMap ? Object.values(videoMap).flat() : undefined
  const counts = {} as Record<string, number>
  const channelToId = {} as Record<string, string>

  if (preFiltered) {
    for (const row of preFiltered) {
      if (!counts[row.channel]) {
        counts[row.channel] = 0
      }
      counts[row.channel]++
    }
  }
  if (videoMap) {
    for (const [key, val] of Object.entries(videoMap)) {
      channelToId[val[0].channel] = key
    }
  }
  const lcFilter = filter.toLowerCase()
  const playlist = preFiltered?.filter(
    f =>
      f.channel.toLowerCase().includes(lcFilter) ||
      f.title.toLowerCase().includes(lcFilter),
  )

  function idx(r: number) {
    if (!playlist) {
      return undefined
    }
    return playlist[
      shuffle
        ? Math.floor(Math.random() * playlist.length)
        : clamp(
            playlist?.findIndex(p => playing === p.videoId) + r,
            0,
            playlist.length,
          )
    ]
  }

  return {
    goToNext: () => setPlaying(idx(1)?.videoId),
    goToPrev: () => setPlaying(idx(-1)?.videoId),
    playing,
    setPlaying,
    counts,
    playlist,
    channelToId,
  }
}
