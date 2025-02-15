import { observer } from 'mobx-react-lite'

import Button from './Button'
import Checkbox from './Checkbox'

import type { StoreModel } from './store'

const PlayerControls = observer(function ({ model }: { model: StoreModel }) {
  return (
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
