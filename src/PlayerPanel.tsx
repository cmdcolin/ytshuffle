import YouTube from 'react-youtube'
import PlaylistTable from './PlaylistTable'
import { Playlist } from './util'
import PlayerControls from './PlayerControls'
import { StoreModel } from './store'
import { observer } from 'mobx-react'

const options = {
  height: 390,
  width: 640,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

export default observer(function PlayerPanel({
  model,
  playing,
  playlist,
  playlists,
  goToNext,
  goToPrev,
  setPlaying,
}: {
  model: StoreModel
  playing?: string
  playlist: Playlist
  playlists: Record<string, string>
  goToPrev: () => void
  goToNext: () => void
  setPlaying: (arg?: string) => void
}) {
  return (
    <div className="container">
      {playlist.length > 0 ? (
        <div>
          <div>
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
            playlist={playlist}
            playing={playing}
            onPlay={videoId => setPlaying(videoId)}
          />
        </div>
      ) : null}
      <div>
        <PlayerControls
          model={model}
          goToNext={goToNext}
          goToPrev={goToPrev}
          playlists={playlists}
          setPlaying={setPlaying}
        />
        {playing ? (
          <YouTube
            videoId={playing}
            opts={options}
            onEnd={() => {
              if (model.autoplay) {
                goToNext()
              }
            }}
          />
        ) : (
          <div
            style={{
              ...options,
              background: 'grey',
            }}
          />
        )}
      </div>
    </div>
  )
})
