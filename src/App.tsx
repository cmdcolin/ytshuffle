// locals
import ErrorMessage from './ErrorMessage'
import PlaylistList from './playlist//PlaylistList'
import PlaylistEditor from './playlist/PlaylistEditor'
import PlayerPanel from './player/PlayerPanel'
import Footer from './Footer'
import Header from './Header'

// hooks
import createStore, { StoreModel } from './store'
import { observer } from 'mobx-react'

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
        <div className="playlist_header">
          <PlaylistEditor model={model} />
          <PlaylistList model={model} />
        </div>

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
