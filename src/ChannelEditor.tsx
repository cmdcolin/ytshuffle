import { observer } from 'mobx-react-lite'

// locals
import PlaylistControls from './PlaylistControls'
import type { StoreModel } from './store'
import { useLocalStorage } from './util'
import Button from './Button'

const ChannelEditor = observer(function ({ model }: { model: StoreModel }) {
  const [hide, setHide] = useLocalStorage('hide_form', false)
  return (
    <div>
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
                      - URLs for a youtube channel (URL like
                      https://youtube.com/@username)
                    </li>
                    <li>
                      - URLs for individual youtube videos (will download the
                      whole channel's worth of info from it)
                    </li>
                    <li>
                      - URLs for youtube playlists (URL contains e.g. list=)
                    </li>
                  </ul>
                </label>
              </div>
              <textarea
                id="video"
                className="p-1 w-full h-[100px] bg-gray-200 dark:bg-gray-800 "
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

export default ChannelEditor
