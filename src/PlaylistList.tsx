import localforage from 'localforage'
import { StoreModel } from './store'

export default function PlaylistList({
  counts,
  channelToId,
  model,
}: {
  counts: Record<string, number>
  channelToId: Record<string, string>
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
            <td>All ({Object.values(counts).reduce((a, b) => a + b, 0)})</td>
            <td>
              <button onClick={() => model.setFilter('')}>Show all</button>
            </td>
            <td>
              <button
                onClick={async () => {
                  await Promise.all(
                    Object.values(channelToId).map(item =>
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
          {Object.entries(counts).map(([key, value]) => (
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
                    await localforage.removeItem(channelToId[key])
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
}
