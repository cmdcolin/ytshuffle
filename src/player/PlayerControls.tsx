import { observer } from 'mobx-react'
import PlaylistSelector from '../playlist/PlaylistSelector'
import { StoreModel } from '../store'

const PlayerControls = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div className="player_controls">
      <div>
        <button onClick={() => model.setPlaying()}>Stop</button>
        <button onClick={() => model.goToNext()}>Next</button>
        <button onClick={() => model.goToPrev()}>Prev</button>
        <PlaylistSelector model={model} />
      </div>
      <div>
        <input
          id="shuffle"
          type="checkbox"
          checked={model.shuffle}
          onChange={event => model.setShuffle(event.target.checked)}
        />
        <label style={{ marginLeft: 5 }} htmlFor="shuffle">
          Shuffle?{' '}
        </label>
      </div>
      <div>
        <input
          id="follow_playing"
          type="checkbox"
          checked={model.follow}
          onChange={event => model.setFollow(event.target.checked)}
        />
        <label style={{ marginLeft: 5 }} htmlFor="follow_playing">
          Cursor follows currently playing track?{' '}
        </label>
      </div>
      <div>
        <input
          id="autoplay"
          type="checkbox"
          checked={model.autoplay}
          onChange={event => model.setAutoplay(event.target.checked)}
        />
        <label style={{ marginLeft: 5 }} htmlFor="autoplay">
          Autoplay?{' '}
        </label>
      </div>
    </div>
  )
})

export default PlayerControls
