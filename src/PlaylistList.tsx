import localforage from 'localforage'

export default function Filtering({
  counts,
  channelToId,
  setFilter,
}: {
  counts: Record<string, number>
  channelToId: Record<string, string>
  setFilter: (arg: string) => void
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
              <button onClick={() => setFilter('')}>Show all</button>
            </td>
            <td>
              <button
                onClick={async () => {
                  await localforage.clear()
                  window.location.reload()
                }}
              >
                Refresh all
              </button>
            </td>
          </tr>
          {Object.entries(counts).map(([key, value]) => (
            <tr key={key}>
              <td>
                {key} ({value || 0})
              </td>
              <td>
                <button onClick={() => setFilter(key)}>
                  Show only this channel
                </button>
              </td>
              <td>
                <button
                  onClick={async () => {
                    await localforage.removeItem(channelToId[key])
                    window.location.reload()
                  }}
                >
                  Refresh channel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
