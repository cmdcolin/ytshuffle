import { observer } from 'mobx-react-lite'

import ChannelEditor from './ChannelEditor'
import ChannelList from './ChannelList'
import ErrorMessage from './ErrorMessage'
import FilterPanel from './FilterPanel'
import Footer from './Footer'
import Header from './Header'
import LibraryTable from './LibraryTable'
import PlayerControls from './PlayerControls'
import YoutubePanel from './YoutubePanel'
import createStore, { type StoreModel } from './store'

export default function App({
  initialQuery,
  initialPlaylist,
}: {
  initialQuery: string
  initialPlaylist: string
}) {
  const model = createStore().create({
    query: initialQuery,
    playlist: initialPlaylist,
  })
  return <App2 model={model} />
}

const App2 = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div className="m-2">
      <Header />
      <AppBody model={model} />
      <Footer />
    </div>
  )
})

const AppBody = observer(function AppBody({ model }: { model: StoreModel }) {
  const { error } = model
  return (
    <div>
      {error ? <ErrorMessage error={error} /> : null}
      <div className="text-sm sm:flex sm:flex-col lg:grid gap-2 lg:grid-cols-2">
        <ChannelEditor model={model} />
        <ChannelList model={model} />

        <div>
          <FilterPanel model={model} />
          <LibraryTable
            model={model}
            onPlay={videoId => {
              model.setPlaying(videoId)
            }}
          />
        </div>
        <div>
          <PlayerControls model={model} />
          <YoutubePanel model={model} />
        </div>
      </div>
    </div>
  )
})
