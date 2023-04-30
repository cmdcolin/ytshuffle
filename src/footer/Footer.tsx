import localforage from 'localforage'
import './footer.css'

export default function Footer({
  showPrivacyPolicy,
}: {
  showPrivacyPolicy: () => void
}) {
  return (
    <div className="footer">
      <a href="https://github.com/cmdcolin/ytshuffle">Source code</a>
      <div className="footer_buttons">
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
