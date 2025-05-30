import { getContentsLambdaEndpoint } from './consts'
import { Item, PreItem, myfetch, remap } from './util'

export async function fetchPlaylist(
  self: {
    setProcessing: (arg: {
      name: string
      current: number
      total: number
    }) => void
  },
  playlistId: string,
) {
  let nextPageToken = ''
  let items = [] as Item[]
  const url = `${getContentsLambdaEndpoint}?playlistId=${playlistId}`
  do {
    const res2 = await myfetch<{
      items: PreItem[]
      nextPageToken: string
      totalResults: number
    }>(url + (nextPageToken ? `&nextPageToken=${nextPageToken}` : ''))

    items = [...items, ...remap(res2.items)]
    self.setProcessing({
      name: playlistId,
      current: items.length,
      total: res2.totalResults,
    })
    nextPageToken = res2.nextPageToken
  } while (nextPageToken)
  return items
}
