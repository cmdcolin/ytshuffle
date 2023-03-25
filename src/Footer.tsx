import localforage from 'localforage'

export default function Footer({
  showPrivacyPolicy,
}: {
  showPrivacyPolicy: () => void
}) {
  return (
    <div className="footer">
      <a href="https://github.com/cmdcolin/ytshuffle">Github</a>
      <p>
        Note: this app caches data to avoid repeatedly fetching data from
        youtube, but will not get new uploads from channels over time.
      </p>
      <p>
        Click here to clear this cache and get e.g. the latest videos from your
        channels{' '}
        <button
          onClick={() => {
            localforage.clear()
            window.location.reload()
          }}
        >
          Clear cache
        </button>
      </p>
      <button onClick={() => showPrivacyPolicy()}>Show privacy policy</button>
    </div>
  )
}
