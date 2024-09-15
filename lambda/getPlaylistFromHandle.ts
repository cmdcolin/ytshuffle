const API_KEY = '/* key */'
const root = 'https://www.googleapis.com/youtube/v3'

async function myfetch(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${res.status} ${await res.text()}`)
  }
  return res.json()
}

async function getVideos(handle: string) {
  const res1 = await myfetch(
    `${root}/channels?part=contentDetails&fromHandle=${handle}&key=${API_KEY}`,
  )
  return res1.items[0].contentDetails.relatedPlaylists.uploads
}

export async function handler({
  queryStringParameters,
}: {
  queryStringParameters: { handle: string }
}) {
  try {
    const { handle } = queryStringParameters
    const result = await getVideos(handle)

    return {
      statusCode: 200,
      body: JSON.stringify({ playlistId: result }),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: `${e}`,
    }
  }
}
