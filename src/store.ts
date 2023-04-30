import { Instance, types } from 'mobx-state-tree'

export default function createStore() {
  return types
    .model({
      query: types.string,
      filter: types.optional(types.string, ''),
      shuffle: true,
      follow: true,
      autoplay: true,
      playlist: types.string,
    })
    .actions(self => ({
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
    }))
}

export type StoreModel = Instance<ReturnType<typeof createStore>>
