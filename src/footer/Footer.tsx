import localforage from 'localforage'
import './footer.css'
import { useLocalStorage } from '../util'
import ConfirmDialog from '../startscreen/ConfirmDialog'

export default function Footer() {
  const [showPolicy, setShowPolicy] = useLocalStorage('confirmed', true)
  return (
    <div className="footer">
      <a href="https://github.com/cmdcolin/ytshuffle">Source code</a>
      <div className="footer_buttons">
        <button
          onClick={() => {
            setShowPolicy(true)
          }}
        >
          Show privacy policy
        </button>
        <button
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            ;(async () => {
              await localforage.clear()
              window.location.reload()
            })()
          }}
        >
          Clear entire local cache
        </button>
      </div>
      <ConfirmDialog
        open={showPolicy}
        onClose={() => {
          setShowPolicy(false)
        }}
      />
    </div>
  )
}
