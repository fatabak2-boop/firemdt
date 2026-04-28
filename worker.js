addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    })
  }

  const url = new URL(request.url)
  
  // Get target URL from query param
  let target = url.searchParams.get('url')
  
  // Or use path-based routing
  if (!target) {
    const type = url.searchParams.get('type')
    if (type === 'rss') {
      target = 'https://data.emergency.vic.gov.au/Show?pageId=getIncidentRSS'
    } else {
      target = 'https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON'
    }
  }

  const response = await fetch(target)
  const body = await response.text()

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=30'
    }
  })
}