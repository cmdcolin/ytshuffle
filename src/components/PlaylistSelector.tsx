import { observer } from 'mobx-react-lite'

import type { StoreModel } from '../store'

const PlaylistSelector = observer(function ({ model }: { model: StoreModel }) {
  const { playlist, playlists } = model
  return (
    <span>
      <select
        id="currplaylist"
        className="m-0.5 select select-sm max-w-[150px]"
        value={playlist}
        onChange={event => {
          model.setPlaylist(event.target.value)
        }}
      >
        <option disabled selected>
          Current playlist:
        </option>
        {(playlists.size > 0
          ? [...playlists.keys()]
          : ['No playlists saved yet']
        ).map(name => (
          <option key={name} value={name} className="py-1">
            Playlist: {name}
          </option>
        ))}
      </select>
    </span>
  )
})

export default PlaylistSelector
