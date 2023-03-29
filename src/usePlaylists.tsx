import { useEffect, useState } from 'react'
import { mydef } from './util'

export default function usePlaylists(query: string, currentPlaylist: string) {
  const returnValue = JSON.parse(
    localStorage.getItem('playlists') || JSON.stringify(mydef),
  )
  // we add default back if there is none because it gets
  // confused on visiting with blank urlparams otherwise
  const [playlists, setPlaylists] = useState({
    ...returnValue,
    [currentPlaylist]: query || '',
  })

  useEffect(() => {
    playlists[currentPlaylist] = query
    localStorage.setItem('playlists', JSON.stringify(playlists))
  }, [query, playlists, currentPlaylist])

  return [playlists, setPlaylists]
}
