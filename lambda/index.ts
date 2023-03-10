const API_KEY = '/* key */'
const root = 'https://www.googleapis.com/youtube/v3'

async function myfetch(url: string) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${response.status} ${await response.text()}`,
    )
  }
  return response.json()
}

async function getVideos(videoId: string, maxResults = '50') {
  const res0 = await myfetch(
    `${root}/videos?part=snippet&id=${videoId}&key=${API_KEY}`,
  )

  const channelId = res0.items[0].snippet.channelId
  const res1 = await myfetch(
    `${root}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`,
  )
  const playlistId = res1.items[0].contentDetails.relatedPlaylists.uploads
  const res2 = await myfetch(
    `${root}/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${API_KEY}`,
  )
  return res2
}

exports.handler = async (event: {
  queryStringParameters: { videoId: string; maxResults: string }
}) => {
  const result = await getVideos(
    event.queryStringParameters.videoId,
    event.queryStringParameters.maxResults,
  )
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
}
