/* global fetch */
const API_KEY = '/* key */'
const root = 'https://www.googleapis.com/youtube/v3'
const playlistRoot = `${root}/playlistItems?part=snippet`

async function myfetch(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${res.status} ${await res.text()}`)
  }
  return res.json()
}
async function getVideos(
  playlistId: string,
  nextPageToken?: string,
  maxResults = '50',
) {
  let url = `${playlistRoot}&maxResults=${maxResults}&playlistId=${playlistId}&key=${API_KEY}`
  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`
  }
  const res = await myfetch(url)
  return {
    items: res.items,
    nextPageToken: res.nextPageToken,
    totalResults: res.pageInfo.totalResults,
  }
}
export async function handler({
  queryStringParameters,
}: {
  queryStringParameters: { playlistId?: string; nextPageToken?: string }
}) {
  try {
    const { playlistId, nextPageToken } = queryStringParameters
    if (!playlistId) {
      throw new Error('No playlistId specified')
    }
    const result = await getVideos(playlistId, nextPageToken)
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: `${e}`,
    }
  }
}
