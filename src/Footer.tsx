import localforage from 'localforage'
import { useLocalStorage } from './util'
import ConfirmDialog from './ConfirmDialog'
import Button from './Button'
import Link from './Link'

export default function Footer() {
  const [showPolicy, setShowPolicy] = useLocalStorage('confirmed', true)
  return (
    <div>
      <Link href="https://github.com/cmdcolin/ytshuffle">Source code</Link>
      <div>
        <Button
          onClick={() => {
            setShowPolicy(true)
          }}
        >
          Show privacy policy
        </Button>
        <Button
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            ;(async () => {
              await localforage.clear()
              window.location.reload()
            })()
          }}
        >
          Clear entire local cache
        </Button>
      </div>
      {showPolicy ? (
        <ConfirmDialog
          open
          onClose={() => {
            setShowPolicy(false)
          }}
        />
      ) : null}
    </div>
  )
}
