import localforage from 'localforage'
import { observer } from 'mobx-react'

// locals
import type { StoreModel } from '../store'
import { useLocalStorage } from '../util'
import Button from '../Button'

const PlaylistList = observer(function ({ model }: { model: StoreModel }) {
  const [showTable, setShowTable] = useLocalStorage('show_playlists', true)
  return (
    <>
      <Button
        onClick={() => {
          setShowTable(s => !s)
        }}
      >
        {showTable ? 'Hide playlist table' : 'Show playlist table'}
      </Button>
      <div className="filtering">
        {showTable ? (
          <table>
            <thead>
              <tr>
                <th>Channels loaded</th>
                <th>Filter</th>
                <th>Refresh</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  All ({Object.values(model.counts).reduce((a, b) => a + b, 0)})
                </td>
                <td>
                  <Button
                    onClick={() => {
                      model.setFilter('')
                    }}
                  >
                    Show all
                  </Button>
                </td>
                <td>
                  <Button
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-floating-promises
                      ;(async () => {
                        await Promise.all(
                          Object.values(model.channelToId).map(item =>
                            localforage.removeItem(item),
                          ),
                        )
                        window.location.reload()
                      })()
                    }}
                  >
                    Clear all and refresh
                  </Button>
                </td>
              </tr>
              {Object.entries(model.counts).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    {key} ({value || 0})
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        model.setFilter(key)
                      }}
                    >
                      Filter
                    </Button>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        ;(async () => {
                          await localforage.removeItem(model.channelToId[key])
                          window.location.reload()
                        })()
                      }}
                    >
                      Clear data and refresh
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </>
  )
})

export default PlaylistList
