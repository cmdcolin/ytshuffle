import { lazy, Suspense } from 'react'
import type { StoreModel } from './store'
import { observer } from 'mobx-react-lite'

const YouTube = lazy(() => import('react-youtube'))

const options = {
  height: 390,
  width: 640,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

const YoutubePanel = observer(function ({ model }: { model: StoreModel }) {
  const { playing, autoplay } = model
  return (
    <>
      {playing ? (
        <Suspense fallback={null}>
          <YouTube
            videoId={playing}
            opts={options}
            onEnd={() => {
              if (autoplay) {
                model.goToNext()
              }
            }}
          />
        </Suspense>
      ) : (
        <div
          style={{
            ...options,
            maxWidth: '100%',
          }}
          className="dark:bg-zinc-700 bg-zinc-300 flex items-center justify-center"
        >
          <h1>Nothing playing</h1>
        </div>
      )}
    </>
  )
})
export default YoutubePanel
