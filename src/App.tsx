import { observer } from 'mobx-react'

// locals
import ErrorMessage from './ErrorMessage'
import PlayerPanel from './PlayerPanel'
import Footer from './Footer'
import Header from './Header'
import PlaylistPanel from './PlaylistPanel'

// hooks
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
  const { error, processing } = model
  return (
    <div className="text-sm flex flex-col space-y-8">
      {error ? <ErrorMessage error={error} /> : null}
      <PlaylistPanel model={model} />

      {processing ? (
        <div>
          Currently processing: {processing.name} ({processing.current}/
          {processing.total})
        </div>
      ) : null}
      <PlayerPanel model={model} />
    </div>
  )
})
