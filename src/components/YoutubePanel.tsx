import { Suspense, lazy } from 'react'

import { observer } from 'mobx-react-lite'

import type { StoreModel } from '../store'

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
          className="bg-zinc-700 flex items-center justify-center"
        >
          <h1>Nothing playing</h1>
        </div>
      )}
    </>
  )
})
export default YoutubePanel
