import PlaylistSelector from './PlaylistSelector'

export default function PlayerControls({
  shuffle,
  autoplay,
  playlists,
  currentPlaylist,
  setCurrentPlaylist,
  setAutoplay,
  setPlaying,
  goToNext,
  goToPrev,
  setShuffle,
}: {
  shuffle: boolean
  autoplay: boolean
  playlists: Record<string, string>
  currentPlaylist: string
  setCurrentPlaylist: (arg: string) => void
  setAutoplay: (arg: boolean) => void
  setQuery: (arg: string) => void
  setPlaying: (arg?: string) => void
  setShuffle: (arg: boolean) => void
  goToNext: () => void
  goToPrev: () => void
}) {
  return (
    <div className="playlist_controls">
      <button onClick={() => setPlaying(undefined)}>Stop</button>
      <button onClick={() => goToNext()}>Next</button>
      <button onClick={() => goToPrev()}>Prev</button>
      <label style={{ marginLeft: 5 }} htmlFor="shuffle">
        Shuffle?{' '}
      </label>
      <input
        id="shuffle"
        type="checkbox"
        checked={shuffle}
        onChange={event => setShuffle(event.target.checked)}
      />
      <label style={{ marginLeft: 5 }} htmlFor="autoplay">
        Autoplay?{' '}
      </label>
      <input
        id="autoplay"
        type="checkbox"
        checked={autoplay}
        onChange={event => setAutoplay(event.target.checked)}
      />
      <PlaylistSelector
        playlists={playlists}
        currentPlaylist={currentPlaylist}
        setCurrentPlaylist={setCurrentPlaylist}
      />
    </div>
  )
}
