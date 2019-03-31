const CronJob = require('cron').CronJob;
const params = require('minimist')(process.argv);
const dgram = require('dgram');
const readline = require('readline');
const server = dgram.createSocket('udp4');
const packet = require('./packet.js');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const queue = [];

const queueFindById = ((q, id) => {
  for (let i = 0; i < q.length; i++) {
    if (q[i]._id === id)
      return i;
  }
  return -1;
});

const job = new CronJob('*/5 * * * * *', () => {
  queue.forEach(pkg => {
    let buffer = JSON.stringify(pkg);
    server.send(buffer, 0, buffer.length, pkg.port, pkg.hostname);
  });
}, null, true, 'America/Sao_Paulo');

let inputMessage = (() => {
  reader.question('Press ENTER to send a new message\n', () => {
    reader.question('Hostname: ', hostname => {
      reader.question('Port: ', port => {
        reader.question('Type a message: ', message => {
          queue.push(packet.create(hostname, port, message));
          console.table(queue);
          inputMessage();
        });
      });
    });
  });
});

server.on('listening', () => {
  let address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
  inputMessage();
});

server.on('message', (message, remote) => {
  try {
    let pkg = JSON.parse(message);
    console.log(`\nMessage received from ${remote.address}:${remote.port}`);
    console.log(`Packet info: ${message}`);
    server.send(pkg._id, 0, pkg._id.length, remote.port, remote.address, () => {
      console.log(`ACK has been sent to ${remote.address}:${remote.port}`);
    });
  } catch(e) {
    let index = queueFindById(queue, message);
    console.log(`ACK received. deleting element ID ${message} from the message queue`);
    queue.splice(index, 1);
    console.table(queue);
    return;
  }
});

server.bind(params.port, '127.0.0.1');