import { autorun } from 'mobx'
import { Instance, addDisposer, types } from 'mobx-state-tree'
import {
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
      playlists: types.frozen(),
    })
    .volatile(() => ({
      videoMap: undefined as PlaylistMap | undefined,
      error: undefined as unknown,
      currentlyProcessing: '',
    }))
    .actions(self => ({
      setPlaying(arg: string) {
        self.playing = arg
      },
      setPlaylist(arg: string) {
        self.playlist = arg
      },
      setQuery(arg: string) {
        self.query = arg
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
        self.currentlyProcessing = arg
      },
      setPlaylists(arg: any) {
        self.playlists = arg
      },
    }))
    .actions(self => ({
      afterCreate() {
        addDisposer(
          self,
          autorun(async () => {
            try {
              self.setError(undefined)
              const items = Object.fromEntries(
                await Promise.all(
                  getIds(self.query).map(async id => {
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
                    return [id, r1] as const
                  }),
                ),
              )

              self.setVideoMap(items)
              self.setCurrentlyProcessing('')
            } catch (e) {
              console.error(e)
              self.setError(e)
            }
          }),
        )

        addDisposer(
          self,
          autorun(() => {
            const returnValue = JSON.parse(
              localStorage.getItem('playlists') || JSON.stringify(mydef),
            )
            // we add default back if there is none because it gets
            // confused on visiting with blank urlparams otherwise
            self.setPlaylists({
              ...returnValue,
              [self.playlist]: self.query || '',
            })
          }),
        )
        addDisposer(
          self,
          autorun(() => {
            localStorage.setItem('playlists', JSON.stringify(self.playlists))
          }),
        )
      },
    }))
}

export type StoreModel = Instance<ReturnType<typeof createStore>>
