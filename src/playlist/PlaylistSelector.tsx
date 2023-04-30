import { observer } from 'mobx-react'
import { StoreModel } from '../store'

export default observer(function PlaylistSelector({
  model,
}: {
  model: StoreModel
}) {
  const { playlist, playlists } = model
  return (
    <>
      <label style={{ marginLeft: 20 }} htmlFor="currplaylist">
        Current playlist:{' '}
      </label>
      <select
        id="currplaylist"
        value={playlist}
        onChange={event => model.setPlaylist(event.target.value)}
      >
        {(playlists.size > 0
          ? [...playlists.keys()]
          : ['No playlists saved yet']
        ).map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </>
  )
})
