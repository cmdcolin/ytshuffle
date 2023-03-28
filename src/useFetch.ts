import localforage from 'localforage'
import { useEffect, useState } from 'react'
import { getIds, myfetch, Playlist, PlaylistMap, PreItem, remap } from './util'

const root =
  'https://39b5dlncof.execute-api.us-east-1.amazonaws.com/youtubeApiV3'
export default function useFetch(query: string) {
  const [error, setError] = useState<unknown>()
  const [currentlyProcessing, setCurrentlyProcessing] = useState('')
  const [videoMap, setVideoMap] = useState<PlaylistMap>()
  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        setError(undefined)
        const videoIds = getIds(query)
        const items = Object.fromEntries(
          await Promise.all(
            videoIds.map(async id => {
              let r1 = await localforage.getItem<Playlist>(id)
              if (!r1) {
                setCurrentlyProcessing(id)
                r1 = remap(
                  await myfetch<PreItem[]>(
                    `${root}?videoId=${id}&maxResults=50`,
                    {
                      signal: controller.signal,
                    },
                  ),
                )
                await localforage.setItem(id, r1)
              }
              return [id, r1] as const
            }),
          ),
        )

        setVideoMap(items)
        setCurrentlyProcessing('')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setError(e)
        }
      }
    })()

    return () => controller.abort()
  }, [query])

  return [videoMap, error, currentlyProcessing] as const
}
