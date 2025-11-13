import { observer } from 'mobx-react-lite'

import ButtonM1 from './ButtonM1'
import Checkbox from './Checkbox'

import type { StoreModel } from '../store'

const PlayerControls = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div>
      <ButtonM1
        onClick={() => {
          model.setPlaying()
        }}
      >
        Stop
      </ButtonM1>
      <ButtonM1
        onClick={() => {
          model.goToNext()
        }}
      >
        Next
      </ButtonM1>
      <ButtonM1
        onClick={() => {
          model.goToPrev()
        }}
      >
        Prev
      </ButtonM1>
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
