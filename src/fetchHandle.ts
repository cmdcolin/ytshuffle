import { getHandleLambdaEndpoint } from './consts'
import { fetchPlaylist } from './fetchPlaylist'
import { myfetch } from './util'

export async function fetchHandle(
  self: {
    setProcessing: (arg: {
      name: string
      current: number
      total: number
    }) => void
  },
  handle: string,
) {
  const res = await myfetch<{ playlistId: string }>(
    `${getHandleLambdaEndpoint}?handle=${handle}`,
  )
  return fetchPlaylist(self, res.playlistId)
}
