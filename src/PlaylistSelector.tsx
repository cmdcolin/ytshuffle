import { observer } from 'mobx-react-lite'

import type { StoreModel } from './store'

const PlaylistSelector = observer(function ({ model }: { model: StoreModel }) {
  const { playlist, playlists } = model
  return (
    <span>
      <label htmlFor="currplaylist">Current playlist:</label>
      <select
        id="currplaylist"
        className="border border-slate-700 rounded-sm p-1 ml-2"
        value={playlist}
        onChange={event => {
          model.setPlaylist(event.target.value)
        }}
      >
        {(playlists.size > 0
          ? [...playlists.keys()]
          : ['No playlists saved yet']
        ).map(name => (
          <option key={name} value={name} className="py-1">
            {name}
          </option>
        ))}
      </select>
    </span>
  )
})

export default PlaylistSelector
