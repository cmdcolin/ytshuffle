import YouTube from 'react-youtube'
import PlaylistTable from './PlaylistTable'
import PlayerControls from './PlayerControls'
import { StoreModel } from './store'
import { observer } from 'mobx-react'

const options = {
  height: 390,
  width: 640,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

export default observer(function PlayerPanel({ model }: { model: StoreModel }) {
  return (
    <div className="container">
      <div>
        <div>
          <label htmlFor="filter">Filter: </label>
          <input
            id="filter"
            type="text"
            value={model.filter}
            onChange={event => model.setFilter(event.target.value)}
          />
        </div>
        <PlaylistTable
          model={model}
          onPlay={videoId => model.setPlaying(videoId)}
        />
      </div>
      <div>
        <PlayerControls model={model} />
        {model.playing ? (
          <YouTube
            videoId={model.playing}
            opts={options}
            onEnd={() => {
              if (model.autoplay) {
                model.goToNext()
              }
            }}
          />
        ) : (
          <div
            style={{
              ...options,
              background: 'grey',
            }}
          />
        )}
      </div>
    </div>
  )
})
