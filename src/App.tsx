import { observer } from 'mobx-react'

// locals
import ErrorMessage from './ErrorMessage'
import Footer from './Footer'
import Header from './Header'
import ChannelEditor from './ChannelEditor'

// hooks
import createStore, { type StoreModel } from './store'
import FilterPanel from './FilterPanel'
import PlayerControls from './PlayerControls'
import YoutubePanel from './YoutubePanel'
import LibraryTable from './LibraryTable'
import ChannelList from './ChannelList'

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
      <div className="text-sm sm:flex sm:flex-col lg:grid lg:grid-cols-2">
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
