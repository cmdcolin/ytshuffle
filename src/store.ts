import { addDisposer, types } from '@jbrowse/mobx-state-tree'
import localforage from 'localforage'
import { autorun, observable } from 'mobx'

import { fetchItems } from './fetchFromChannel'
import { fetchHandle } from './fetchHandle'
import { fetchPlaylist } from './fetchPlaylist'
import {
  clamp,
  getHandles,
  getIds,
  getPlaylistIds,
  getVideoIds,
  mydef,
} from './util'

import type { Playlist } from './util'
import type { Instance } from '@jbrowse/mobx-state-tree'

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
          video =>
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            video.channel?.toLowerCase().includes(lc) ||
            video.title?.toLowerCase().includes(lc),
        )
      },
      get counts() {
        const c = {} as Record<string, number>
        for (const { channel = '' } of this.videoFlat) {
          c[channel] = (c[channel] || 0) + 1
        }
        return c
      },
      get channelToId() {
        const c = {} as Record<string, string>
        for (const [key, value] of self.videoMap.entries()) {
          c[value[0].channel ?? ''] = key
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
            const url = new URL(globalThis.location.href)
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
            globalThis.history.replaceState({}, '', url)
          }),
        )
      },
    }))
}

export type StoreModel = Instance<ReturnType<typeof createStore>>
