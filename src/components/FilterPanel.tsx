import { observer } from 'mobx-react-lite'

import ButtonM1 from './ButtonM1'

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
      <ButtonM1
        onClick={() => {
          model.setFilter('')
        }}
      >
        Clear
      </ButtonM1>
    </div>
  )
})

export default FilterPanel
