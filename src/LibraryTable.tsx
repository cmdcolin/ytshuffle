import { useEffect, useState } from 'react'

import { formatDistanceToNowStrict } from 'date-fns'
import { observer } from 'mobx-react-lite'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'

import Button from './Button'

import type { StoreModel } from './store'

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-slate-700 dark:bg-slate-800 bg-slate-300 z-10 text-left">
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

const LibraryTable = observer(function ({
  model,
  onPlay,
}: {
  model: StoreModel
  onPlay: (string_: string) => void
}) {
  const { playing, follow, list } = model
  const [sortName, setSortName] = useState(0)
  const [sortDate, setSortDate] = useState(0)
  useEffect(() => {
    if (follow) {
      // id starts with vid because id must start with alphachar
      document
        .querySelector(`#vid${playing}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [playing, follow])
  const l2 = list
    .map(l => ({ ...l, publishedAt: +new Date(l.publishedAt) }))
    .toSorted((a, b) => (a.title ?? '').localeCompare(b.title ?? '') * sortName)
    .toSorted((a, b) => (a.publishedAt - b.publishedAt) * sortDate)
  return (
    <div className="max-h-[500px] overflow-auto">
      {l2.length > 0 ? (
        <table className="border-collapse border border-slate-500">
          <thead>
            <tr>
              <Th>np</Th>
              <Th>
                <div className="ml-1">
                  <Button
                    onClick={() => {
                      if (sortName === 0) {
                        setSortName(-1)
                      } else if (sortName === -1) {
                        setSortName(1)
                      } else {
                        setSortName(0)
                      }
                    }}
                  >
                    title{' '}
                    {sortName === 1 ? (
                      <FaChevronUp className="inline" />
                    ) : sortName === -1 ? (
                      <FaChevronDown className="inline" />
                    ) : null}
                  </Button>
                </div>
              </Th>
              <Th>channel</Th>
              <Th>
                <Button
                  onClick={() => {
                    if (sortDate === 0) {
                      setSortDate(-1)
                    } else if (sortDate === -1) {
                      setSortDate(1)
                    } else {
                      setSortDate(0)
                    }
                  }}
                >
                  published{' '}
                  {sortDate === 1 ? (
                    <FaChevronUp className="inline" />
                  ) : sortDate === -1 ? (
                    <FaChevronDown className="inline" />
                  ) : null}
                </Button>
              </Th>
              <Th>play</Th>
            </tr>
          </thead>
          <tbody>
            {l2.map(item => (
              <tr key={item.id} id={`vid${item.videoId}`}>
                <Td>{item.videoId === playing ? '>' : ''}</Td>
                <Td>{item.title}</Td>
                <Td>{item.channel}</Td>
                <Td>{formatDistanceToNowStrict(item.publishedAt)}</Td>
                <Td>
                  <Button
                    onClick={() => {
                      onPlay(item.videoId)
                    }}
                  >
                    Play
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2>No data loaded yet</h2>
      )}
    </div>
  )
})
export default LibraryTable
