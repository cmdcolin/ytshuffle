import YouTube from 'react-youtube'
import PlaylistTable from './PlaylistTable'
import { Playlist } from './util'
import PlayerControls from './PlayerControls'

const opts = {
  height: 390,
  width: 640,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1 as const,
  },
}

export default function PlayerPanel({
  filter,
  playing,
  playlist,
  shuffle,
  followPlaying,
  currentPlaylist,
  playlists,
  autoplay,
  goToNext,
  goToPrev,
  setCurrentPlaylist,
  setAutoplay,
  setFollowPlaying,
  setShuffle,
  setQuery,
  setFilter,
  setPlaying,
}: {
  filter: string
  playing?: string
  followPlaying: boolean
  playlist: Playlist
  shuffle: boolean
  autoplay: boolean
  playlists: Record<string, string>
  currentPlaylist: string
  goToPrev: () => void
  goToNext: () => void
  setFilter: (arg: string) => void
  setPlaying: (arg?: string) => void
  setAutoplay: (arg: boolean) => void
  setFollowPlaying: (arg: boolean) => void
  setQuery: (arg: string) => void
  setShuffle: (arg: boolean) => void
  setCurrentPlaylist: (arg: string) => void
}) {
  return (
    <div className="player_panel">
      <div>
        <label htmlFor="filter">Filter/search table: </label>
        <input
          id="filter"
          type="text"
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />
        <button onClick={() => setFilter('')}>Clear filter</button>
      </div>
      <div className="container">
        <PlaylistTable
          followPlaying={followPlaying}
          playlist={playlist}
          playing={playing}
          onPlay={videoId => setPlaying(videoId)}
        />
        <div>
          <PlayerControls
            currentPlaylist={currentPlaylist}
            followPlaying={followPlaying}
            setFollowPlaying={setFollowPlaying}
            goToNext={goToNext}
            goToPrev={goToPrev}
            autoplay={autoplay}
            shuffle={shuffle}
            playlists={playlists}
            setQuery={setQuery}
            setCurrentPlaylist={setCurrentPlaylist}
            setPlaying={setPlaying}
            setShuffle={setShuffle}
            setAutoplay={setAutoplay}
          />
          {playing ? (
            <YouTube
              videoId={playing}
              opts={opts}
              onEnd={() => {
                if (autoplay) {
                  goToNext()
                }
              }}
            />
          ) : (
            <div
              style={{
                ...opts,
                background: 'grey',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
