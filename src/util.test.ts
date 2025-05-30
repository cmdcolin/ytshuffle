import { expect, test } from 'vitest'

import { getIds, getVideoId } from './util'

test('getVideoId parses different YouTube URL formats', () => {
  // Test channel handle URLs
  expect(getVideoId('https://www.youtube.com/@whitecentipedenoise')).toEqual({
    handle: 'whitecentipedenoise',
  })

  // Test with channel URL and query parameters
  expect(
    getVideoId('https://youtube.com/@whitecentipedenoise?si=mezeX670I7Kve08h'),
  ).toEqual({
    handle: 'whitecentipedenoise',
  })

  // Test with multiple query parameters
  expect(
    getVideoId(
      'https://www.youtube.com/@somechannel?si=abc123&feature=channel',
    ),
  ).toEqual({
    handle: 'somechannel',
  })

  // Test with non-www domain
  expect(getVideoId('https://youtube.com/@somechannel')).toEqual({
    handle: 'somechannel',
  })

  // Test with channel handle containing special characters
  expect(getVideoId('https://youtube.com/@channel-with_special.chars')).toEqual(
    {
      handle: 'channel-with_special.chars',
    },
  )

  // Test playlist URLs
  expect(
    getVideoId(
      'https://www.youtube.com/playlist?list=PLWIFgIFN2QqgcqnwaQMud0HJWLMiFAK7i',
    ),
  ).toEqual({
    playlistId: 'PLWIFgIFN2QqgcqnwaQMud0HJWLMiFAK7i',
  })

  // Test video URLs
  expect(getVideoId('https://www.youtube.com/watch?v=3oJqulA8lQc')).toEqual({
    videoId: '3oJqulA8lQc',
  })

  // Test short youtu.be URLs
  expect(getVideoId('https://youtu.be/3oJqulA8lQc')).toEqual({
    videoId: '3oJqulA8lQc',
  })

  // Test embed URLs
  expect(getVideoId('https://www.youtube.com/embed/3oJqulA8lQc')).toEqual({
    videoId: '3oJqulA8lQc',
  })

  // Test video URL with playlist
  expect(
    getVideoId(
      'https://www.youtube.com/watch?v=3oJqulA8lQc&list=PLWIFgIFN2QqgcqnwaQMud0HJWLMiFAK7i',
    ),
  ).toEqual({
    playlistId: 'PLWIFgIFN2QqgcqnwaQMud0HJWLMiFAK7i',
  })

  // Test invalid URL
  expect(getVideoId('https://example.com')).toBeUndefined()
})

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
