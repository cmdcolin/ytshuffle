// locals
import ErrorMessage from './ErrorMessage'
import PlaylistList from './PlaylistList'
import PlaylistEditor from './PlaylistEditor'
import Footer from './Footer'
import PlayerPanel from './PlayerPanel'
import Header from './Header'

// hooks
import useUrlParameters from './useUrlParameters'
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
  useUrlParameters(model.query, model.playlist)

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
