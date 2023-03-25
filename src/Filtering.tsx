export default function Filtering({
  counts,
  filter,
  setFilter,
}: {
  filter: string
  counts: Record<string, number>
  setFilter: (arg: string) => void
}) {
  return (
    <div className="filtering">
      <div>
        Channels loaded (click button to filter particular channel):{' '}
        {Object.entries(counts).map(([key, value]) => (
          <button key={key} onClick={() => setFilter(key)}>
            {key} ({value || 0})
          </button>
        ))}
        <button onClick={() => setFilter('')}>All</button>
      </div>
      <div>
        <label htmlFor="filter">Filter/search table: </label>
        <input
          id="filter"
          type="text"
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />
      </div>
    </div>
  )
}
