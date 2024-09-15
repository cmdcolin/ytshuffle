import logo from '../favicon.svg'
import { version } from '../package.json'

export default function Header() {
  return (
    <div className="flex mb-2 p-2">
      <img height={40} style={{ height: 40 }} src={logo} />
      <h1 className="ml-4 m-1 font-extrabold">ytshuffle</h1>
      <h6 className="m-1">{version}</h6>
    </div>
  )
}
