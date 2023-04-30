import { observer } from 'mobx-react'
import PlaylistSelector from './PlaylistSelector'
import { StoreModel } from './store'

export default observer(function PlayerControls({
  model,
  playlists,
  setPlaying,
  goToNext,
  goToPrev,
}: {
  model: StoreModel
  playlists: Record<string, string>
  setPlaying: (arg?: string) => void
  goToNext: () => void
  goToPrev: () => void
}) {
  return (
    <div className="player_controls">
      <div>
        <button onClick={() => setPlaying()}>Stop</button>
        <button onClick={() => goToNext()}>Next</button>
        <button onClick={() => goToPrev()}>Prev</button>
        <PlaylistSelector model={model} playlists={playlists} />
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
