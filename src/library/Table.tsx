import { useEffect } from 'react'
import { format } from 'timeago.js'
import { observer } from 'mobx-react'

import { StoreModel } from '../store'
import './library.css'

const PlaylistTable = observer(function ({
  model,
  onPlay,
}: {
  model: StoreModel
  onPlay: (string_: string) => void
}) {
  const { playing, follow, list } = model
  useEffect(() => {
    if (follow) {
      // id starts with vid because id must start with alphachar
      document
        .querySelector(`#vid${playing}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [playing, follow])
  return (
    <div className="library_table">
      {list.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>np</th>
              <th>title</th>
              <th>channel</th>
              <th>published</th>
              <th>play</th>
            </tr>
          </thead>
          <tbody>
            {list.map(item => (
              <tr key={item.id} id={`vid${item.videoId}`}>
                <td>{item.videoId === playing ? '>' : ''}</td>
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
      ) : (
        <h2 style={{ width: 500, maxWidth: '100%' }}>No data loaded yet</h2>
      )}
    </div>
  )
})
export default PlaylistTable
