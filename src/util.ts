export async function myfetch<T>(url: string, rest?: RequestInit) {
  const response = await fetch(url, rest)
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return response.json() as T
}

export function getvideoid(url: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match?.[2].length == 11) {
    return match[2]
  } else {
    return undefined
  }
}

export interface PreItem {
  id: string
  snippet: {
    videoOwnerChannelTitle: string
    resourceId: { videoId: string }
    title: string
    publishedAt: string
  }
}

export interface Item {
  id: string
  channel: string
  videoId: string
  title: string
  publishedAt: string
}

export type Playlist = Item[]

export type PlaylistMap = Record<string, Playlist>
