import { useState } from 'react'
import { PlaylistMap, clamp } from './util'

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
    for (const [key, value] of Object.entries(videoMap)) {
      channelToId[value[0].channel] = key
    }
  }
  const lcFilter = filter.toLowerCase()
  const playlist = preFiltered?.filter(
    f =>
      f.channel.toLowerCase().includes(lcFilter) ||
      f.title.toLowerCase().includes(lcFilter),
  )

  function index(r: number) {
    if (!playlist) {
      return
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
    goToNext: () => setPlaying(index(1)?.videoId),
    goToPrev: () => setPlaying(index(-1)?.videoId),
    playing,
    setPlaying,
    counts,
    playlist,
    channelToId,
  }
}
