import logo from '../favicon.svg'

export default function Header() {
  return (
    <div className="flex mb-2">
      <img height={40} style={{ height: 40 }} src={logo} />
      <h1 className="ml-4 m-1 font-extrabold">ytshuffle</h1>
    </div>
  )
}
