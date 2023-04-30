import { useEffect } from 'react'
import { format } from 'timeago.js'
import { StoreModel } from './store'
import { observer } from 'mobx-react'

export default observer(function PlaylistTable({
  model,
  onPlay,
}: {
  model: StoreModel
  onPlay: (string_: string) => void
}) {
  useEffect(() => {
    if (model.follow) {
      // id starts with vid because id must start with alphachar
      document
        .querySelector(`#vid${model.playing}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [model.playing, model.follow])
  return (
    <div className="playlist_table">
      <table>
        <thead>
          <tr>
            <th>np</th>
            <th>title</th>
            <th>channel</th>
            <th>published at</th>
            <th>play</th>
          </tr>
        </thead>
        <tbody>
          {model.list.map(item => (
            <tr key={item.id} id={`vid${item.videoId}`}>
              <td>{item.videoId === model.playing ? '>' : ''}</td>
              <td>{item.title}</td>
              <td>{item.channel}</td>
              <td>{format(item.publishedAt)}</td>
              <td>
                <button onClick={() => onPlay(item.videoId)}>Play</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
