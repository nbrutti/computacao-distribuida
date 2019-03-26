let dgram = require('dgram');
let server = dgram.createSocket('udp4');
let config = require('./config');

server.on('listening', () => {
  let address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  console.log(`${remote.address}:${remote.port} - ${message}`);
});

server.bind(config.PORT, config.HOST);