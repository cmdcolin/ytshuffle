import { observer } from 'mobx-react'
import { StoreModel } from './store'

export default observer(function PlaylistSelector({
  model,
}: {
  model: StoreModel
}) {
  const keys = Object.keys(model.playlists).sort()
  return (
    <>
      <label style={{ marginLeft: 20 }} htmlFor="currplaylist">
        Current playlist:{' '}
      </label>
      <select
        id="currplaylist"
        value={model.playlist}
        onChange={event => model.setPlaylist(event.target.value)}
      >
        {(keys.length > 0 ? keys : ['No playlists saved yet']).map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </>
  )
})
