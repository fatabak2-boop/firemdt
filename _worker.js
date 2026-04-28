export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/proxy') {
      const target = url.searchParams.get('url');
      if (!target) return new Response('Missing url', { status: 400 });
      const response = await fetch(target, { headers: { 'User-Agent': 'FireMDT/1.0' } });
      const body = await response.text();
      return new Response(body, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=30'
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
