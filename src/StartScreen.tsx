import App from './App'

const s = (l: string) => decodeURIComponent(l)

export default function StartScreen() {
  const urlParameters = new URLSearchParams(globalThis.location.search)

  const ids = s(urlParameters.get('ids') ?? '')
    .split(',')
    .filter(f => !!f)
    .map(id => `https://www.youtube.com/watch?v=${id}`)
  const pids = s(urlParameters.get('pids') ?? '')
    .split(',')
    .filter(f => !!f)
    .map(id => `https://www.youtube.com/watch?list=${id}`)
  const handles = s(urlParameters.get('handles') ?? '')
    .split(',')
    .filter(f => !!f)
    .map(id => `https://www.youtube.com/@${id}`)

  const playlist = s(urlParameters.get('playlist') ?? 'default')

  return (
    <App
      initialQuery={[...ids, ...pids, ...handles].join('\n')}
      initialPlaylist={playlist}
    />
  )
}
