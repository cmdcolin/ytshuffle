import { useState } from 'react'
import { PlaylistMap } from './util'

export default function usePlayerControls(
  videoMap: PlaylistMap | undefined,
  filter: string,
  shuffle: boolean,
) {
  const [playing, setPlaying] = useState<string>()
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

  return { goToPrev, goToNext, playing, setPlaying, counts, playlist }
}
