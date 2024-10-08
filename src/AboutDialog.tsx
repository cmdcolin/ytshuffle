import BaseDialog from './BaseDialog'
import Link from './Link'
import logo from '../favicon.svg'
import { version } from '../package.json'

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
        <Link href="https://github.com/cmdcolin/ytshuffle">Source code</Link>
      </div>
    </BaseDialog>
  )
}
