import { observer } from 'mobx-react'

// locals
import PlaylistControls from './PlaylistControls'
import type { StoreModel } from './store'
import { useLocalStorage } from './util'
import Button from './Button'

const PlaylistEditor = observer(function ({ model }: { model: StoreModel }) {
  const [hide, setHide] = useLocalStorage('hide_form', false)
  return (
    <div className="border max-w-[800px]">
      <Button
        onClick={() => {
          setHide(s => !s)
        }}
      >
        {hide ? 'Show controls' : 'Hide controls'}
      </Button>
      {hide ? null : (
        <div className="p-4">
          <div>Enter list of:</div>
          <div>
            <div>
              <div className="mb-3">
                <label htmlFor="video">
                  <ul>
                    <li>
                      - URLs for individual youtube videos (URL contains e.g.
                      v=)
                    </li>
                    <li>
                      - URLs for youtube playlists (URL contains e.g. list=)
                    </li>
                  </ul>
                  <p className="mt-3">
                    In the first case, the app will download all videos from the
                    channel that uploaded the video, and in the second case, it
                    will download all videos from just that playlist.
                  </p>
                </label>
              </div>
              <textarea
                id="video"
                className="p-1 w-full h-[100px]"
                value={model.query}
                onChange={event => {
                  model.setQuery(event.target.value)
                }}
              />
            </div>
          </div>
          <PlaylistControls model={model} />
        </div>
      )}
    </div>
  )
})

export default PlaylistEditor
