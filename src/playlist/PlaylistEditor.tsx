import { observer } from 'mobx-react'

// locals
import PlaylistControls from './PlaylistControls'
import { StoreModel } from '../store'
import { useLocalStorage } from '../util'
import './playlist.css'

export default observer(function PlaylistEditor({
  model,
}: {
  model: StoreModel
}) {
  const [hide, setHide] = useLocalStorage('hide_form', false)
  return (
    <div>
      <button onClick={() => setHide(s => !s)}>
        {hide ? 'Show controls' : 'Hide controls'}
      </button>
      {hide ? null : (
        <div className="playlist_editor">
          <div className="text_header">Enter list of:</div>
          <div className="playlist_margin">
            <label className="form_description" htmlFor="video">
              <ul>
                <li>
                  URLs for individual youtube videos (URL contains e.g. v=)
                </li>
                <li>URLs for youtube playlists (URL contains e.g. list=)</li>
              </ul>
              In the first case, the app will download all videos from the
              channel that uploaded the video, and in the second case, it will
              download all videos from just that playlist.
            </label>
            <textarea
              id="video"
              className="form_editor"
              value={model.query}
              onChange={event => model.setQuery(event.target.value)}
            />
          </div>
          <PlaylistControls model={model} />
        </div>
      )}
    </div>
  )
})
