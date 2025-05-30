import localforage from 'localforage'
import { observer } from 'mobx-react-lite'

import Button from './Button'
import { useLocalStorage } from '../util'

import type { StoreModel } from '../store'

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border bg-slate-800 border border-slate-500 z-10 text-left">
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="max-w-[500px] border border-slate-700 pl-1 pr-1">
      {children}
    </td>
  )
}

const ChannelList = observer(function ({ model }: { model: StoreModel }) {
  const [showTable, setShowTable] = useLocalStorage('show_playlists', true)
  const { processing } = model
  return (
    <div>
      <Button
        onClick={() => {
          setShowTable(s => !s)
        }}
      >
        {showTable ? 'Hide channel table' : 'Show channel table'}
      </Button>
      {processing ? (
        <div>
          Currently processing: {processing.name} ({processing.current}/
          {processing.total})
        </div>
      ) : null}
      {showTable ? (
        <div className="overflow-auto">
          <div className="p-4 max-h-[200px]">
            <table className="border-collapse border border-slate-500">
              <thead>
                <tr>
                  <Th>Channels loaded</Th>
                  <Th>Filter</Th>
                  <Th>Refresh</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>
                    All (
                    {Object.values(model.counts).reduce((a, b) => a + b, 0)})
                  </Td>
                  <Td>
                    <Button
                      onClick={() => {
                        model.setFilter('')
                      }}
                    >
                      Show all
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        ;(async () => {
                          await Promise.all(
                            Object.values(model.channelToId).map(item =>
                              localforage.removeItem(item),
                            ),
                          )
                          globalThis.location.reload()
                        })()
                      }}
                    >
                      Clear all and refresh
                    </Button>
                  </Td>
                </tr>
                {Object.entries(model.counts).map(([key, value]) => (
                  <tr key={key}>
                    <Td>
                      {key} ({value || 0})
                    </Td>
                    <Td>
                      <Button
                        onClick={() => {
                          model.setFilter(key)
                        }}
                      >
                        Filter
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-floating-promises
                          ;(async () => {
                            await localforage.removeItem(model.channelToId[key])
                            globalThis.location.reload()
                          })()
                        }}
                      >
                        Clear data and refresh
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
})

export default ChannelList
