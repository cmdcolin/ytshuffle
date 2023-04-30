import localforage from 'localforage'
import { observer } from 'mobx-react'
import { StoreModel } from '../store'

export default observer(function PlaylistList({
  model,
}: {
  model: StoreModel
}) {
  return (
    <div className="filtering">
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
              <button onClick={() => model.setFilter('')}>Show all</button>
            </td>
            <td>
              <button
                onClick={async () => {
                  await Promise.all(
                    Object.values(model.channelToId).map(item =>
                      localforage.removeItem(item),
                    ),
                  )
                  window.location.reload()
                }}
              >
                Clear all and refresh
              </button>
            </td>
          </tr>
          {Object.entries(model.counts).map(([key, value]) => (
            <tr key={key}>
              <td>
                {key} ({value || 0})
              </td>
              <td>
                <button onClick={() => model.setFilter(key)}>Filter</button>
              </td>
              <td>
                <button
                  onClick={async () => {
                    await localforage.removeItem(model.channelToId[key])
                    window.location.reload()
                  }}
                >
                  Clear data and refresh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
