import { useEffect, useMemo, useState } from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { formatDistanceToNowStrict } from 'date-fns'
import { observer } from 'mobx-react-lite'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'

import Button from './Button'

import type { StoreModel } from './store'
import type { Item } from './util'
import type { SortingState } from '@tanstack/react-table'

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border border-slate-700 dark:bg-slate-800 bg-slate-600 z-10 text-left sticky top-0 shadow-sm after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-slate-700">
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

// Define our extended Item type with publishedAt as number
type ExtendedItem = Omit<Item, 'publishedAt'> & { publishedAt: number }

const columnHelper = createColumnHelper<ExtendedItem>()

const LibraryTable = observer(function ({
  model,
  onPlay,
}: {
  model: StoreModel
  onPlay: (string_: string) => void
}) {
  const { playing, follow, list } = model
  const [sorting, setSorting] = useState<SortingState>([])

  // Process the list data
  const data = useMemo((): ExtendedItem[] => {
    return list.map(l => ({
      ...l,
      publishedAt: +new Date(l.publishedAt),
    }))
  }, [list])

  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('videoId', {
        id: 'nowPlaying',
        header: 'np',
        cell: info => (info.getValue() === playing ? '>' : ''),
      }),
      columnHelper.accessor('title', {
        header: ({ column }) => {
          return (
            <div className="ml-1">
              <Button
                onClick={() => {
                  if (column.getIsSorted() === false) {
                    column.toggleSorting(false) // Sort ascending
                  } else if (column.getIsSorted() === 'asc') {
                    column.toggleSorting(true) // Sort descending
                  } else {
                    // Remove sorting
                    setSorting(prev =>
                      prev.filter(sort => sort.id !== column.id),
                    )
                  }
                }}
              >
                title{' '}
                {column.getIsSorted() === 'asc' ? (
                  <FaChevronUp className="inline" />
                ) : column.getIsSorted() === 'desc' ? (
                  <FaChevronDown className="inline" />
                ) : null}
              </Button>
            </div>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('channel', {
        header: ({ column }) => {
          return (
            <Button
              onClick={() => {
                if (column.getIsSorted() === false) {
                  column.toggleSorting(false) // Sort ascending
                } else if (column.getIsSorted() === 'asc') {
                  column.toggleSorting(true) // Sort descending
                } else {
                  // Remove sorting
                  setSorting(prev => prev.filter(sort => sort.id !== column.id))
                }
              }}
            >
              channel{' '}
              {column.getIsSorted() === 'asc' ? (
                <FaChevronUp className="inline" />
              ) : column.getIsSorted() === 'desc' ? (
                <FaChevronDown className="inline" />
              ) : null}
            </Button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('publishedAt', {
        header: ({ column }) => {
          return (
            <Button
              onClick={() => {
                if (column.getIsSorted() === false) {
                  column.toggleSorting(false) // Sort ascending
                } else if (column.getIsSorted() === 'asc') {
                  column.toggleSorting(true) // Sort descending
                } else {
                  // Remove sorting
                  setSorting(prev => prev.filter(sort => sort.id !== column.id))
                }
              }}
            >
              published{' '}
              {column.getIsSorted() === 'asc' ? (
                <FaChevronUp className="inline" />
              ) : column.getIsSorted() === 'desc' ? (
                <FaChevronDown className="inline" />
              ) : null}
            </Button>
          )
        },
        cell: info => formatDistanceToNowStrict(info.getValue()),
      }),
      columnHelper.display({
        id: 'play',
        cell: info => (
          <Button
            onClick={() => {
              onPlay(info.row.original.videoId)
            }}
          >
            Play
          </Button>
        ),
      }),
    ],
    [playing, onPlay],
  )

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Scroll to currently playing item
  useEffect(() => {
    if (follow && playing) {
      // id starts with vid because id must start with alphachar
      document
        .querySelector(`#vid${playing}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [playing, follow])

  return (
    <div className="max-h-[500px] overflow-auto overscroll-none">
      {data.length > 0 ? (
        <table className="w-full border-collapse border border-slate-500">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} id={`vid${row.original.videoId}`}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
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
