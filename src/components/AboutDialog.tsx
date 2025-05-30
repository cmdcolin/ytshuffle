import BaseDialog from './BaseDialog'
import Link from './Link'
import { version } from '../../package.json'
import logo from '../favicon.svg'

export default function AboutDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <BaseDialog open={open} onClose={onClose}>
      <div className="flex flex-col space-y-8">
        <div className="flex">
          <img height={40} style={{ height: 40 }} src={logo} />
          <h1 className="ml-4 m-1 font-extrabold">ytshuffle</h1>
          <h6 className="m-1">{version}</h6>
        </div>
        Source code/contact/report issues:{' '}
        <Link href="https://github.com/cmdcolin/ytshuffle">GitHub</Link>
      </div>
    </BaseDialog>
  )
}
