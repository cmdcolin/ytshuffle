import { observer } from 'mobx-react-lite'

import type { StoreModel } from '../store'

const FilterPanel = observer(function ({ model }: { model: StoreModel }) {
  return (
    <div className="mb-3">
      <label htmlFor="filter">Search: </label>
      <input
        id="filter"
        type="text"
        className="input input-sm"
        value={model.filter}
        onChange={event => {
          model.setFilter(event.target.value)
        }}
      />
    </div>
  )
})

export default FilterPanel
