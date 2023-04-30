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
          <div className="text_header">Enter list of youtube videos</div>
          <div>
            <div>
              <label htmlFor="video">
                Enter a list of youtube videos separated by newlines, this page
                will then gather all the videos from the channels that uploaded
                these videos (I couldn't figure out how to fetch videos from the
                channel URL itself):
              </label>
            </div>
            <div>
              <textarea
                cols={70}
                rows={5}
                style={{ maxWidth: '100%' }}
                id="video"
                value={model.query}
                onChange={event => model.setQuery(event.target.value)}
              />
            </div>
            <PlaylistControls model={model} />
          </div>
        </div>
      )}
    </div>
  )
})
