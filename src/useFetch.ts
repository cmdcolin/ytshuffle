import localforage from 'localforage'
import { useEffect, useState } from 'react'
import { getIds, myfetch, Playlist, PlaylistMap, PreItem, remap } from './util'

const root =
  'https://39b5dlncof.execute-api.us-east-1.amazonaws.com/youtubeApiV3'
export default function useFetch(query: string) {
  const [error, setError] = useState<unknown>()
  const [videoMap, setVideoMap] = useState<PlaylistMap>()
  useEffect(() => {
    let controller = new AbortController()
    const maxResults = 50
    ;(async () => {
      try {
        setError(undefined)
        const videoIds = getIds(query)
        const items = Object.fromEntries(
          await Promise.all(
            videoIds.map(async id => {
              const key = id + '_' + maxResults
              let r1 = await localforage.getItem<Playlist>(key)
              if (!r1) {
                r1 = remap(
                  await myfetch<PreItem[]>(
                    `${root}?videoId=${id}&maxResults=${maxResults}`,
                    {
                      signal: controller.signal,
                    },
                  ),
                )
                await localforage.setItem(key, r1)
              }
              return [key, r1] as const
            }),
          ),
        )

        setVideoMap(items)
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setError(e)
        }
      }
    })()

    return () => controller.abort()
  }, [query])

  return [videoMap, error] as const
}
