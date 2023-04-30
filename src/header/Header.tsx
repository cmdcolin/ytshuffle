// @ts-expect-error
import logo from '../favicon.svg'
import './header.css'
import { version } from '../../package.json'

export default function Header() {
  return (
    <div className="header">
      <img height={40} src={logo} />
      <h1 className="title">ytshuffle</h1>
      <h6 className="version">{version}</h6>
    </div>
  )
}
