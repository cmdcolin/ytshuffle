// locals
import ErrorMessage from './ErrorMessage'
import PlaylistList from './playlist/PlaylistList'
import PlaylistEditor from './playlist/PlaylistEditor'
import PlayerPanel from './player/PlayerPanel'
import Footer from './footer/Footer'
import Header from './header/Header'

import './App.css'

// hooks
import createStore, { StoreModel } from './store'
import { observer } from 'mobx-react'
import PlaylistPanel from './playlist/PlaylistPanel'

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
      <div className="App">
        {model.error ? <ErrorMessage error={model.error} /> : null}
        <PlaylistPanel model={model} />

        <div>
          {model.currentlyProcessing ? (
            <div>Currently processing: {model.currentlyProcessing}</div>
          ) : null}
        </div>
        <PlayerPanel model={model} />
      </div>
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
    </>
  )
})
