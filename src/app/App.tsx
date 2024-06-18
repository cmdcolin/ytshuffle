import { observer } from 'mobx-react'

// locals
import ErrorMessage from '../ErrorMessage'
import PlayerPanel from '../player/PlayerPanel'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import PlaylistPanel from '../playlist/PlaylistPanel'

import './App.css'

// hooks
import createStore, { type StoreModel } from '../store'

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
    <>
      <Header />
      <AppBody model={model} />
      <Footer />
    </>
  )
})

const AppBody = observer(function AppBody({ model }: { model: StoreModel }) {
  const { error, processing } = model
  return (
    <div className="App">
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
