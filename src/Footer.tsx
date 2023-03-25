import localforage from 'localforage'

export default function Footer({
  showPrivacyPolicy,
}: {
  showPrivacyPolicy: () => void
}) {
  return (
    <div className="footer">
      (c) 2023 <a href="https://github.com/cmdcolin/ytshuffle">Github</a>
      <div className="privacy">
        <button onClick={() => showPrivacyPolicy()}>Show privacy policy</button>
      </div>
    </div>
  )
}
