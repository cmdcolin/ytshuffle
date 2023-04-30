import { autorun } from 'mobx'
import { Instance, addDisposer, types } from 'mobx-state-tree'
import {
  clamp,
  getIds,
  mydef,
  myfetch,
  Playlist,
  PlaylistMap,
  PreItem,
  remap,
} from './util'
import localforage from 'localforage'

const root =
  'https://39b5dlncof.execute-api.us-east-1.amazonaws.com/youtubeApiV3'

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
      videoMap: undefined as PlaylistMap | undefined,
      error: undefined as unknown,
      processing: '',
    }))
    .actions(self => ({
      setPlaying(arg?: string) {
        self.playing = arg
      },
      setPlaylist(arg: string) {
        self.playlist = arg
        console.log('here', arg)
        self.query = self.playlists.get(arg) || ''
      },
      setQuery(arg: string) {
        self.query = arg
        console.log('here2', arg, self.playlist)
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
      setVideoMap(arg: PlaylistMap) {
        self.videoMap = arg
      },
      setCurrentlyProcessing(arg: string) {
        self.processing = arg
      },
      setPlaylists(arg: Record<string, string>) {
        self.playlists.replace(arg)
      },
    }))
    .views(self => ({
      get list() {
        const pre = Object.values(self.videoMap || {}).flat()
        const lc = self.filter.toLowerCase()
        return pre.filter(
          f =>
            f.channel.toLowerCase().includes(lc) ||
            f.title.toLowerCase().includes(lc),
        )
      },
      get counts() {
        const c = {} as Record<string, number>
        for (const row of Object.values(self.videoMap || {}).flat()) {
          c[row.channel] = (c[row.channel] || 0) + 1
        }
        return c
      },
      get channelToId() {
        const c = {} as Record<string, string>
        for (const [key, value] of Object.entries(self.videoMap || {})) {
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
              for (const id of getIds(self.query)) {
                let r1 = await localforage.getItem<Playlist>(id)
                if (!r1) {
                  self.setCurrentlyProcessing(id)
                  r1 = remap(
                    await myfetch<PreItem[]>(
                      `${root}?videoId=${id}&maxResults=50`,
                    ),
                  )
                  await localforage.setItem(id, r1)
                }
                self.setVideoMap({ ...self.videoMap, [id]: r1 })
              }
            } catch (e) {
              console.error(e)
              self.setError(e)
            } finally {
              self.setCurrentlyProcessing('')
            }
          }),
        )

        addDisposer(
          self,
          autorun(() => {
            console.log(self.playlists.toJSON())
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
            url.searchParams.set('ids', s(getIds(self.query).join(',')))
            url.searchParams.set('playlist', s(self.playlist))
            window.history.replaceState({}, '', url)
          }),
        )
      },
    }))
}

export type StoreModel = Instance<ReturnType<typeof createStore>>
