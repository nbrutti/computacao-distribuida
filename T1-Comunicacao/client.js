let config = require('./config');
let dgram = require('dgram');
let readline = require('readline');

let client = dgram.createSocket('udp4');

let reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputMessage = (() => {
  reader.question('Enter the message: ', (message) => {
    if (message === 'exit') return reader.close();
    client.send(message, 0, message.length, config.PORT, config.HOST, () => {
      console.log(`UDP message sent to ${config.HOST}:${config.PORT}`);
    });
    inputMessage();
  });
});

inputMessage();