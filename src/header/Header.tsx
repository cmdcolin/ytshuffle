// @ts-expect-error
import logo from '../favicon.svg'
import './header.css'

export default function Header() {
  return (
    <div className="header">
      <img height={40} src={logo} />
      <h1 className="title">{'  '}ytshuffle</h1>
    </div>
  )
}
