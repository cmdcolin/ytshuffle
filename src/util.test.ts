import { expect, test } from 'vitest'
import { getIds } from './util'

test('get video ids', () => {
  expect(
    getIds(
      'https://www.youtube.com/watch?v=uMRqnJ9yZiU\nhttps://www.youtube.com/watch?v=GHIYeB-TGj0&t=1843s',
    ),
  ).toMatchSnapshot()
})

test('get playlist', () => {
  expect(
    getIds(
      'https://www.youtube.com/playlist?list=PLWIFgIFN2QqgcqnwaQMud0HJWLMiFAK7i',
    ),
  ).toMatchSnapshot()
})

test('get playlist with video id', () => {
  expect(
    getIds(
      'https://www.youtube.com/watch?v=yzrsCaLqm0Q&list=PLWIFgIFN2QqgcqnwaQMud0HJWLMiFAK7i&index=1',
    ),
  ).toMatchSnapshot()
})
