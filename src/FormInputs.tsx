export default function FormInputs({
  query,
  setQuery,
}: {
  query: string
  setQuery: (arg: string) => void
}) {
  return (
    <div>
      <div style={{ maxWidth: 600 }}>
        <label htmlFor="video">
          Enter a list of youtube videos separated by newlines, this page will
          then gather all the videos from the channels that uploaded these
          videos (I couldn't figure out how to fetch videos from the channel URL
          itself):
        </label>
        <div>
          <textarea
            cols={80}
            rows={10}
            id="video"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
