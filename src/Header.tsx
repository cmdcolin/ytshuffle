// @ts-expect-error
import logo from './favicon.svg'

export default function Header() {
  return (
    <div className="header">
      <img height={40} src={logo} />
      <h1 style={{ margin: 0, marginLeft: 10 }}>{'  '}ytshuffle</h1>
    </div>
  )
}
