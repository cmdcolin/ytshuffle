import { useEffect, useRef, useState } from 'react'

export async function myfetch<T>(url: string, rest?: RequestInit) {
  const response = await fetch(url, rest)
  if (!response.ok) {
    throw new Error(await response.text())
  }
  return response.json() as T
}

// xref https://stackoverflow.com/a/9102270/2129219
export function getVideoId(url: string) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match?.[2].length == 11 ? match[2] : undefined
}

export function remap(items: PreItem[]): Item[] {
  return items.map(item => ({
    id: item.id,
    channel: item.snippet.videoOwnerChannelTitle,
    videoId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt,
  }))
}

export function getIds(text: string) {
  return text
    .split('\n')
    .map(f => f.trim())
    .filter((f): f is string => !!f)
    .map(f => getVideoId(f))
    .filter((f): f is string => !!f)
}

export interface PreItem {
  id: string
  snippet: {
    videoOwnerChannelTitle: string
    resourceId: { videoId: string }
    title: string
    publishedAt: string
  }
}

export interface Item {
  id: string
  channel: string
  videoId: string
  title: string
  publishedAt: string
}

export type Playlist = Item[]

export type PlaylistMap = Record<string, Playlist>

export const mydef = {
  default: '',
  example: 'https://www.youtube.com/watch?v=3oJqulA8lQc',
}

export function clamp(p: number, min: number, max: number) {
  return Math.max(min, Math.min(max, p))
}

export function useDialogShown(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null)
  const shown = useRef(false)
  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (open) {
      if (!shown.current) {
        ref.current.showModal()
      }
      shown.current = true
    } else {
      if (shown.current) {
        ref.current.close()
      }
      shown.current = false
    }
  }, [open])
  return ref
}

// Hook from https://usehooks.com/useLocalStorage/
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }
  return [storedValue, setValue] as const
}
