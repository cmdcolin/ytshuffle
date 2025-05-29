import { useEffect, useRef } from 'react'

import { FaX } from 'react-icons/fa6'

import Button from './Button'
import { useDialogShown } from './util'

export default function BaseDialog({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const ref = useDialogShown(open)
  const ref2 = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref2.current && !ref2.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <Button
          className="float-right"
          onClick={() => {
            onClose()
          }}
        >
          <FaX />
        </Button>
        <div ref={ref2}>{children}</div>
      </div>
    </dialog>
  )
}
