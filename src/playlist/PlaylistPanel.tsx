import { StoreModel } from '../store'
import PlaylistEditor from './PlaylistEditor'
import PlaylistList from './PlaylistList'

export default function PlaylistPanel({ model }: { model: StoreModel }) {
  return (
    <div className="playlist_header">
      <PlaylistEditor model={model} />
      <PlaylistList model={model} />
    </div>
  )
}
