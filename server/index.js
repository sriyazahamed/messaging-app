const server = require('./server');
const ngrok = require('./ngrok');

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV === 'production') {
  ngrok(port);
}

server.listen(port);
console.log(`[${port}] server listening...`);
