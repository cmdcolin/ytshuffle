import BaseDialog from './BaseDialog'
import Link from './Link'

export default function AboutDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <BaseDialog open={open} onClose={onClose}>
      <p>
        This app was made to create a 'library' of youtube videos kind of like a
        youtube library
      </p>
      <Link href="https://github.com/cmdcolin/ytshuffle">Source code</Link>
    </BaseDialog>
  )
}
