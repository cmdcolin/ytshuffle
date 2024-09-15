import { observer } from 'mobx-react-lite'
import PlaylistSelector from './PlaylistSelector'
import type { StoreModel } from './store'
import Button from './Button'
import Checkbox from './Checkbox'

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
      <Checkbox
        id="shuffle"
        label="Shuffle?"
        checked={model.shuffle}
        onChange={event => {
          model.setShuffle(event.target.checked)
        }}
      />
      <Checkbox
        id="follow_playing"
        label="Cursor follows currently playing track?"
        checked={model.follow}
        onChange={event => {
          model.setFollow(event.target.checked)
        }}
      />
      <Checkbox
        id="autoplay"
        label="Autoplay?"
        checked={model.autoplay}
        onChange={event => {
          model.setAutoplay(event.target.checked)
        }}
      />
    </div>
  )
})

export default PlayerControls
