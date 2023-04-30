import { expect, test } from 'vitest'
import { getIds } from './util'

test('getIds', () => {
  expect(
    getIds(
      'https://www.youtube.com/watch?v=uMRqnJ9yZiU\nhttps://www.youtube.com/watch?v=GHIYeB-TGj0&t=1843s',
    ),
  ).toMatchSnapshot()
})
