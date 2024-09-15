import { autorun, observable } from 'mobx'
import { type Instance, addDisposer, types } from 'mobx-state-tree'
import {
  clamp,
  getHandles,
  getIds,
  getPlaylistIds,
  getVideoIds,
  mydef,
  myfetch,
  remap,
  type Item,
  type Playlist,
  type PreItem,
} from './util'
import localforage from 'localforage'

const getChannel =
  'https://hwml60od9i.execute-api.us-east-1.amazonaws.com/default/youtubeGetChannel'

const getContents =
  'https://m0v7dr1zz2.execute-api.us-east-1.amazonaws.com/default/youtubeGetPlaylistContents'

const getHandle =
  'https://gbt7w5u4c1.execute-api.us-east-1.amazonaws.com/default/youtubeGetPlaylistFromHandle'

const s = (l: string) => encodeURIComponent(l)

export default function createStore() {
  return types
    .model({
      query: types.string,
      filter: types.optional(types.string, ''),
      shuffle: true,
      follow: true,
      autoplay: true,
      playlist: types.string,
      playing: types.maybe(types.string),
      playlists: types.optional(types.map(types.string), () =>
        JSON.parse(localStorage.getItem('playlists') ?? JSON.stringify(mydef)),
      ),
    })
    .volatile(() => ({
      videoMap: observable.map<string, Playlist>(),
      error: undefined as unknown,
      processing: undefined as
        | { current: number; name: string; total: number }
        | undefined,
    }))
    .actions(self => ({
      setPlaying(arg?: string) {
        self.playing = arg
      },
      setPlaylist(arg: string) {
        self.playlist = arg
        self.query = self.playlists.get(arg) ?? ''
      },
      setQuery(arg: string) {
        self.query = arg
        self.playlists.set(self.playlist, self.query)
      },

      setFilter(arg: string) {
        self.filter = arg
      },
      setShuffle(arg: boolean) {
        self.shuffle = arg
      },
      setFollow(arg: boolean) {
        self.follow = arg
      },
      setAutoplay(arg: boolean) {
        self.autoplay = arg
      },
      setError(arg: unknown) {
        self.error = arg
      },
      setProcessing(arg?: { name: string; current: number; total: number }) {
        self.processing = arg
      },
      setPlaylists(arg: Record<string, string>) {
        self.playlists.replace(arg)
      },
    }))
    .views(self => ({
      get videoFlat() {
        return [...self.videoMap.values()].flat()
      },
      get list() {
        const lc = self.filter.toLowerCase()
        return this.videoFlat.filter(
          f =>
            f.channel.toLowerCase().includes(lc) ||
            f.title.toLowerCase().includes(lc),
        )
      },
      get counts() {
        const c = {} as Record<string, number>
        for (const row of this.videoFlat) {
          c[row.channel] = (c[row.channel] || 0) + 1
        }
        return c
      },
      get channelToId() {
        const c = {} as Record<string, string>
        for (const [key, value] of self.videoMap.entries()) {
          c[value[0].channel] = key
        }
        return c
      },
      index(r: number) {
        const p = this.list
        return p[
          self.shuffle
            ? Math.floor(Math.random() * p.length)
            : clamp(
                p.findIndex(p => self.playing === p.videoId) + r,
                0,
                p.length,
              )
        ]
      },
    }))
    .actions(self => ({
      goToNext() {
        self.setPlaying(self.index(1).videoId)
      },
      goToPrev() {
        self.setPlaying(self.index(-1).videoId)
      },
      afterCreate() {
        addDisposer(
          self,
          autorun(async () => {
            try {
              self.setError(undefined)
              for (const item of getIds(self.query)) {
                if ('videoId' in item && item.videoId) {
                  const { videoId } = item
                  let videos = await localforage.getItem<Playlist>(videoId)
                  if (!videos) {
                    self.setProcessing({
                      name: videoId,
                      total: 0,
                      current: 0,
                    })
                    videos = await fetchItems(self, videoId)
                    await localforage.setItem(videoId, videos)
                  }
                  self.videoMap.set(videoId, videos)
                } else if ('playlistId' in item && item.playlistId) {
                  const { playlistId } = item
                  let videos = await localforage.getItem<Playlist>(playlistId)
                  if (!videos) {
                    videos = await fetchPlaylist(self, playlistId)
                    await localforage.setItem(playlistId, videos)
                  }
                  self.videoMap.set(playlistId, videos)
                } else if ('handle' in item && item.handle) {
                  const { handle } = item
                  let videos = await localforage.getItem<Playlist>(handle)
                  if (!videos) {
                    videos = await fetchHandle(self, handle)
                    await localforage.setItem(handle, videos)
                  }
                  self.videoMap.set(handle, videos)
                }
              }
              const keys = new Set([
                ...getVideoIds(self.query),
                ...getPlaylistIds(self.query),
                ...getHandles(self.query),
              ])
              for (const key of self.videoMap.keys()) {
                if (!keys.has(key)) {
                  self.videoMap.delete(key)
                }
              }
            } catch (error) {
              console.error(error)
              self.setError(error)
            } finally {
              self.setProcessing()
            }
          }),
        )

        addDisposer(
          self,
          autorun(() => {
            localStorage.setItem(
              'playlists',
              JSON.stringify({
                ...self.playlists.toJSON(),
                [self.playlist]: self.query,
              }),
            )
          }),
        )
        addDisposer(
          self,
          autorun(() => {
            const url = new URL(window.location.href)
            const playlistIds = getPlaylistIds(self.query)
            const videoIds = getVideoIds(self.query)
            const handles = getHandles(self.query)
            if (videoIds.length > 0) {
              url.searchParams.set('ids', s(videoIds.join(',')))
            }
            if (playlistIds.length > 0) {
              url.searchParams.set('pids', s(playlistIds.join(',')))
            }
            if (handles.length > 0) {
              url.searchParams.set('handles', s(handles.join(',')))
            }
            url.searchParams.set('playlist', s(self.playlist))
            window.history.replaceState({}, '', url)
          }),
        )
      },
    }))
}

async function fetchItems(
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
    `${getChannel}?videoId=${videoId}`,
  )
  return fetchPlaylist(self, res.playlistId)
}

async function fetchHandle(
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
    `${getHandle}?handle=${handle}`,
  )
  return fetchPlaylist(self, res.playlistId)
}

async function fetchPlaylist(
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
  const url = `${getContents}?playlistId=${playlistId}`
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

export type StoreModel = Instance<ReturnType<typeof createStore>>
