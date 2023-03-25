import localforage from 'localforage'

export default function Footer({
  showPrivacyPolicy,
}: {
  showPrivacyPolicy: () => void
}) {
  return (
    <div className="footer">
      <a href="https://github.com/cmdcolin/ytshuffle">Source code</a>
      <div className="privacy">
        <button onClick={() => showPrivacyPolicy()}>Show privacy policy</button>
        <button
          onClick={async () => {
            await localforage.clear()
            window.location.reload()
          }}
        >
          Clear entire local cache
        </button>
      </div>
    </div>
  )
}
