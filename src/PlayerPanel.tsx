import { observer } from 'mobx-react'

import PlaylistTable from './LibraryTable'
import PlayerControls from './PlayerControls'
import YoutubePanel from './YoutubePanel'
import FilterPanel from './FilterPanel'
import type { StoreModel } from './store'

const PlayerPanel = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div className="container">
      <div>
        <FilterPanel model={model} />
        <PlaylistTable
          model={model}
          onPlay={videoId => {
            model.setPlaying(videoId)
          }}
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
