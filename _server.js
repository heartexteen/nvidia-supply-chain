const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname);
const PORT = 8765;
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
               '.csv':'text/csv', '.json':'application/json', '.png':'image/png',
               '.jpg':'image/jpeg', '.svg':'image/svg+xml' };
http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('serving', ROOT, 'on', PORT));
