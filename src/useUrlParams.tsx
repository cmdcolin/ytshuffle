import { useEffect } from 'react'
import { getIds } from './util'

export default function useUrlParams(query: string, playlist: string) {
  useEffect(() => {
    var url = new URL(window.location.href)
    url.searchParams.set('ids', getIds(query).join(','))
    url.searchParams.set('playlist', playlist)
    window.history.replaceState({}, '', url)
  }, [query, playlist])
}
