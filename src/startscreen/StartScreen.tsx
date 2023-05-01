import App from '../app/App'

const s = (l: string) => decodeURIComponent(l)

export default function StartScreen() {
  const urlParameters = new URLSearchParams(window.location.search)

  const ids = s(urlParameters.get('ids') || '')
    .split(',')
    .filter(f => !!f)
    .map(id => `https://www.youtube.com/watch?v=${id}`)
  const pids = s(urlParameters.get('pids') || '')
    .split(',')
    .filter(f => !!f)
    .map(id => `https://www.youtube.com/watch?list=${id}`)

  const playlist = s(urlParameters.get('playlist') || 'default')

  return (
    <App
      initialQuery={[...ids, ...pids].join('\n')}
      initialPlaylist={playlist}
    />
  )
}
