const http = require('http');
const https = require('https');

const targetHost = 'l761dniu80.execute-api.us-east-2.amazonaws.com';
const targetPath = '/default/exercise_api';

const proxyServer = http.createServer((req, res) => {
  const options = {
    hostname: targetHost,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetHost, // Set the correct host header
    },
    rejectUnauthorized: false,
  };

  const proxy = https.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (err) => {
    console.error('Error in proxy request:', err);
    res.writeHead(500);
    res.end();
  });
});

const port = 3000;
proxyServer.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});

module.exports = proxyServer;