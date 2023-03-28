import { useEffect } from 'react'
import { getIds } from './util'

export default function useUrlParams(query: string, playlist: string) {
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('ids', getIds(query).join(','))
    window.history.replaceState({}, '', url)
  }, [query, playlist])
}
