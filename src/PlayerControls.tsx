import PlaylistSelector from './PlaylistSelector'

export default function PlayerControls({
  shuffle,
  autoplay,
  playlists,
  currentPlaylist,
  followPlaying,
  setCurrentPlaylist,
  setAutoplay,
  setPlaying,
  goToNext,
  goToPrev,
  setShuffle,
  setFollowPlaying,
}: {
  shuffle: boolean
  autoplay: boolean
  followPlaying: boolean
  playlists: Record<string, string>
  currentPlaylist: string
  setCurrentPlaylist: (arg: string) => void
  setAutoplay: (arg: boolean) => void
  setQuery: (arg: string) => void
  setPlaying: (arg?: string) => void
  setShuffle: (arg: boolean) => void
  setFollowPlaying: (arg: boolean) => void
  goToNext: () => void
  goToPrev: () => void
}) {
  return (
    <div className="player_controls">
      <div>
        <button onClick={() => setPlaying(undefined)}>Stop</button>
        <button onClick={() => goToNext()}>Next</button>
        <button onClick={() => goToPrev()}>Prev</button>
        <PlaylistSelector
          playlists={playlists}
          currentPlaylist={currentPlaylist}
          setCurrentPlaylist={setCurrentPlaylist}
        />
      </div>
      <div>
        <input
          id="shuffle"
          type="checkbox"
          checked={shuffle}
          onChange={event => setShuffle(event.target.checked)}
        />
        <label style={{ marginLeft: 5 }} htmlFor="shuffle">
          Shuffle?{' '}
        </label>
      </div>
      <div>
        <input
          id="follow_playing"
          type="checkbox"
          checked={followPlaying}
          onChange={event => setFollowPlaying(event.target.checked)}
        />
        <label style={{ marginLeft: 5 }} htmlFor="follow_playing">
          Cursor follows currently playing track?{' '}
        </label>
      </div>
      <div>
        <input
          id="autoplay"
          type="checkbox"
          checked={autoplay}
          onChange={event => setAutoplay(event.target.checked)}
        />
        <label style={{ marginLeft: 5 }} htmlFor="autoplay">
          Autoplay?{' '}
        </label>
      </div>
    </div>
  )
}
