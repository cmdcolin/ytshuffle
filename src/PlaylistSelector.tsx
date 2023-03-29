export default function PlaylistSelector({
  currentPlaylist,
  playlists,
  setCurrentPlaylist,
}: {
  currentPlaylist: string
  playlists: Record<string, string>
  setCurrentPlaylist: (arg: string) => void
}) {
  const keys = Object.keys(playlists).sort()
  return (
    <>
      <label style={{ marginLeft: 20 }} htmlFor="currplaylist">
        Current playlist:{' '}
      </label>
      <select
        id="currplaylist"
        value={currentPlaylist}
        onChange={event => setCurrentPlaylist(event.target.value)}
      >
        {(keys.length > 0 ? keys : ['No playlists saved yet']).map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </>
  )
}
