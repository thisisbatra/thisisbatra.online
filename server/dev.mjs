import http from 'node:http';
import contact from '../api/contact.mjs';

const server = http.createServer(async (req, res) => {
  res.status = code => { res.statusCode = code; return res; };
  res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  if (req.url !== '/api/contact') return res.status(404).json({ error: 'Not found' });
  try { await contact(req, res); } catch {
    if (!res.headersSent) res.status(500).json({ error: 'The contact form is temporarily unavailable.' });
  }
});
server.listen(3001, '127.0.0.1', () => console.log('Contact API listening on http://127.0.0.1:3001'));
