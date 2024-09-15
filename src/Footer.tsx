import { lazy, Suspense, useState } from 'react'
import localforage from 'localforage'
import Button from './Button'

const ConfirmDialog = lazy(() => import('./ConfirmDialog'))
const AboutDialog = lazy(() => import('./AboutDialog'))

export default function Footer() {
  const [showPolicy, setShowPolicy] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  return (
    <div className="mt-20">
      <div>
        <Button
          onClick={() => {
            setShowAbout(true)
          }}
        >
          About
        </Button>
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
        <Suspense fallback={null}>
          <ConfirmDialog
            open
            onClose={() => {
              setShowPolicy(false)
            }}
          />
        </Suspense>
      ) : null}
      {showAbout ? (
        <Suspense fallback={null}>
          <AboutDialog
            open
            onClose={() => {
              setShowAbout(false)
            }}
          />
        </Suspense>
      ) : null}
    </div>
  )
}
