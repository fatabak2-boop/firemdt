export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
      });
    }
    
    if (url.pathname === '/proxy') {
      const target = url.searchParams.get('url');
      if (!target) return new Response('Missing url', { status: 400 });
      
      try {
        const response = await fetch(target, {
          headers: { 'User-Agent': 'FireMDT/1.0' }
        });
        const body = await response.text();
        return new Response(body, {
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'max-age=30'
          }
        });
      } catch(e) {
        return new Response('Error: ' + e.message, { status: 500 });
      }
    }
    
    // Serve static assets
    return env.ASSETS.fetch(request);
  }
};
