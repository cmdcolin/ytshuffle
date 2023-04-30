import { useEffect } from 'react'
// locals
import ErrorMessage from './ErrorMessage'
import PlaylistList from './PlaylistList'
import PlaylistEditor from './PlaylistEditor'
import Footer from './Footer'
import PlayerPanel from './PlayerPanel'
import Header from './Header'

// hooks
import usePlayerControls from './usePlayerControls'
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
  const {
    playlist,
    channelToId,
    counts,
    playing,
    goToNext,
    goToPrev,
    setPlaying,
  } = usePlayerControls(model.videoMap, model.filter, model.shuffle)

  useUrlParameters(model.query, model.playlist)

  console.log(model.playlist)

  useEffect(() => {
    model.setQuery(model.playlists[model.playlist] || '')
  }, [model.playlist])

  return (
    <>
      <Header />
      <div className="App">
        {model.error ? <ErrorMessage error={model.error} /> : null}
        {playlist ? (
          <>
            <div className="playlist_header">
              <PlaylistEditor model={model} />
              <PlaylistList
                model={model}
                counts={counts}
                channelToId={channelToId}
              />
            </div>

            <div>
              {model.currentlyProcessing ? (
                <div>Currently processing: {model.currentlyProcessing}</div>
              ) : null}
            </div>
            <PlayerPanel
              model={model}
              playing={playing}
              goToNext={goToNext}
              goToPrev={goToPrev}
              setPlaying={setPlaying}
              playlist={playlist}
            />
          </>
        ) : null}
      </div>
      <Footer showPrivacyPolicy={showPrivacyPolicy} />
    </>
  )
})
