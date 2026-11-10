// Preserve the browser Origin header while forwarding local API requests.
// CRA's package.json proxy rewrites Origin, which breaks our origin check.
const http = require('node:http');

module.exports = function setupProxy(app) {
  app.post('/api/contact', (req, res) => {
    const upstream = http.request({
      hostname: '127.0.0.1',
      port: 3001,
      path: '/api/contact',
      method: 'POST',
      headers: { ...req.headers, host: '127.0.0.1:3001' },
    }, response => {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    });
    upstream.setTimeout(60000, () => upstream.destroy(new Error('API timeout')));
    upstream.on('error', () => {
      if (!res.headersSent) res.status(502).json({ error: 'The contact API is unavailable. Please email batranitin118@gmail.com directly.' });
      else res.end();
    });
    req.on('aborted', () => upstream.destroy());
    req.pipe(upstream);
  });
};
