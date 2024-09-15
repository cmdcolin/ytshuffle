import { observer } from 'mobx-react'
import PlaylistSelector from './PlaylistSelector'
import type { StoreModel } from './store'
import Button from './Button'

const PlayerControls = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            model.setPlaying()
          }}
        >
          Stop
        </Button>
        <Button
          onClick={() => {
            model.goToNext()
          }}
        >
          Next
        </Button>
        <Button
          onClick={() => {
            model.goToPrev()
          }}
        >
          Prev
        </Button>
        <PlaylistSelector model={model} />
      </div>
      <div>
        <input
          id="shuffle"
          type="checkbox"
          checked={model.shuffle}
          onChange={event => {
            model.setShuffle(event.target.checked)
          }}
        />
        <label className="ml-2" htmlFor="shuffle">
          Shuffle?{' '}
        </label>
      </div>
      <div>
        <input
          id="follow_playing"
          type="checkbox"
          checked={model.follow}
          onChange={event => {
            model.setFollow(event.target.checked)
          }}
        />
        <label className="ml-2" htmlFor="follow_playing">
          Cursor follows currently playing track?{' '}
        </label>
      </div>
      <div>
        <input
          id="autoplay"
          type="checkbox"
          checked={model.autoplay}
          onChange={event => {
            model.setAutoplay(event.target.checked)
          }}
        />
        <label style={{ marginLeft: 5 }} htmlFor="autoplay">
          Autoplay?{' '}
        </label>
      </div>
    </div>
  )
})

export default PlayerControls
