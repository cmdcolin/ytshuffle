import { observer } from 'mobx-react'

import PlaylistTable from '../library/Table'
import PlayerControls from './PlayerControls'
import YoutubePanel from './YoutubePanel'
import { StoreModel } from '../store'
import './player.css'

const PlayerPanel = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div className="container">
      <div>
        <div className="filter">
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
        <YoutubePanel model={model} />
      </div>
    </div>
  )
})

export default PlayerPanel
