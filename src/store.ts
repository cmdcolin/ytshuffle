import { autorun, observable } from 'mobx'
import { Instance, addDisposer, types } from 'mobx-state-tree'
import {
  clamp,
  getIds,
  getPlaylistIds,
  getVideoIds,
  mydef,
  myfetch,
  Playlist,
  PlaylistMap,
  PreItem,
  remap,
} from './util'
import localforage from 'localforage'

const getChannel =
  'https://hwml60od9i.execute-api.us-east-1.amazonaws.com/default/youtubeGetChannel'

const getContents =
  'https://m0v7dr1zz2.execute-api.us-east-1.amazonaws.com/default/youtubeGetPlaylistContents'

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
        JSON.parse(localStorage.getItem('playlists') || JSON.stringify(mydef)),
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
        self.query = self.playlists.get(arg) || ''
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
        self.setPlaying(self.index(1)?.videoId)
      },
      goToPrev() {
        self.setPlaying(self.index(-1)?.videoId)
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
                  let items = await localforage.getItem<Playlist>(videoId)
                  if (!items) {
                    self.setProcessing({
                      name: videoId,
                      total: 0,
                      current: 0,
                    })
                    items = await fetchItems(self, videoId)
                    await localforage.setItem(videoId, items)
                  }
                  self.videoMap.set(videoId, items)
                } else if ('playlistId' in item && item.playlistId) {
                  const { playlistId } = item
                  let items = await localforage.getItem<Playlist>(playlistId)
                  if (!items) {
                    items = await fetchPlaylist(self, playlistId)
                    self.videoMap.set(playlistId, items)
                  }
                }
              }
              const keys = new Set([
                ...getVideoIds(self.query),
                ...getPlaylistIds(self.query),
              ])
              for (const key of self.videoMap.keys()) {
                if (!keys.has(key)) {
                  self.videoMap.delete(key)
                }
              }
            } catch (e) {
              console.error(e)
              self.setError(e)
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
            url.searchParams.set('ids', s(videoIds.join(',')))
            url.searchParams.set('pids', s(playlistIds.join(',')))
            url.searchParams.set('playlist', s(self.playlist))
            window.history.replaceState({}, '', url)
          }),
        )
      },
    }))
}

async function fetchItems(self: any, videoId: string) {
  const res = await myfetch<{ playlistId: string }>(
    `${getChannel}?videoId=${videoId}`,
  )
  return fetchPlaylist(self, res.playlistId)
}

async function fetchPlaylist(self: any, playlistId: string) {
  let nextPageToken = ''
  let items = [] as any[]
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
