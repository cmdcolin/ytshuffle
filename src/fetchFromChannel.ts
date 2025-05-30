import { getChannelLambdaEndpoint } from './consts'
import { fetchPlaylist } from './fetchPlaylist'
import { myfetch } from './util'

export async function fetchItems(
  self: {
    setProcessing: (arg: {
      name: string
      current: number
      total: number
    }) => void
  },
  videoId: string,
) {
  const res = await myfetch<{ playlistId: string }>(
    `${getChannelLambdaEndpoint}?videoId=${videoId}`,
  )
  return fetchPlaylist(self, res.playlistId)
}
