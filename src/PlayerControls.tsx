export default function PlayerControls({
  shuffle,
  autoplay,
  setAutoplay,
  setQuery,
  setPlaying,
  goToNext,
  goToPrev,
  setShuffle,
}: {
  shuffle: boolean
  autoplay: boolean
  setAutoplay: (arg: boolean) => void
  setQuery: (arg: string) => void
  setPlaying: (arg?: string) => void
  setShuffle: (arg: boolean) => void
  goToNext: () => void
  goToPrev: () => void
}) {
  return (
    <div className="header">
      <div>
        <button onClick={() => setQuery('')}>Clear</button>
        <button onClick={() => setPlaying(undefined)}>Stop</button>
        <button onClick={() => goToNext()}>Next</button>
        <button onClick={() => goToPrev()}>Prev</button>
        <label htmlFor="shuffle">Shuffle? </label>
        <input
          id="shuffle"
          type="checkbox"
          checked={shuffle}
          onChange={event => setShuffle(event.target.checked)}
        />
        <label htmlFor="autoplay">Autoplay? </label>
        <input
          id="autoplay"
          type="checkbox"
          checked={autoplay}
          onChange={event => setAutoplay(event.target.checked)}
        />
      </div>
    </div>
  )
}
