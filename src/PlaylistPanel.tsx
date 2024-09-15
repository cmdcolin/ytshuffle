import type { StoreModel } from './store'
import PlaylistEditor from './PlaylistEditor'
import PlaylistTable from './PlaylistTable'

export default function PlaylistPanel({ model }: { model: StoreModel }) {
  return (
    <div className="flex">
      <PlaylistEditor model={model} />
      <PlaylistTable model={model} />
    </div>
  )
}
