import YouTube from 'react-youtube'
import { StoreModel } from '../store'
import { observer } from 'mobx-react'

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
        <YouTube
          videoId={playing}
          opts={options}
          onEnd={() => {
            if (autoplay) {
              model.goToNext()
            }
          }}
        />
      ) : (
        <div
          className="center"
          style={{
            ...options,
            maxWidth: '100%',
            background: 'grey',
          }}
        >
          <h1>Nothing playing</h1>
        </div>
      )}
    </>
  )
})
export default YoutubePanel
