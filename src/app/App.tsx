import { observer } from 'mobx-react'

// locals
import ErrorMessage from '../ErrorMessage'
import PlayerPanel from '../player/PlayerPanel'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import PlaylistPanel from '../playlist/PlaylistPanel'

import './App.css'

// hooks
import createStore, { StoreModel } from '../store'

export default function App({
  initialQuery,
  initialPlaylist,
  showPrivacyPolicy,
}: {
  initialQuery: string
  initialPlaylist: string
  showPrivacyPolicy: () => void
}) {
  const model = createStore().create({
    query: initialQuery,
    playlist: initialPlaylist,
  })
  return <App2 model={model} showPrivacyPolicy={showPrivacyPolicy} />
}

const App2 = observer(function ({
  model,
  showPrivacyPolicy,
}: {
  model: StoreModel
  showPrivacyPolicy: () => void
}) {
  return (
    <>
      <Header />
      <AppBody model={model} />
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
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
        <div>Currently processing: {processing}</div>
      ) : null}
      <PlayerPanel model={model} />
    </div>
  )
})
