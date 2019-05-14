const CronJob = require('cron').CronJob;
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const params = require('minimist')(process.argv);
const InputReader = require('./InputReader.js');
const reader = new InputReader();
const packet = require('./packet.js');

reader.parseCsv('militaries.csv').then(m => {
  reader.parseCsv('topologies/second.csv').then(l => {
    return main(m, l);
  });
});

let impostores = [];

let neighboors = [];
let received_pkgs = [];
let send_pkgs = [];

// Fila de saída
const queue = [];

const queueFindById = ((q, id) => {
  for (let i = 0; i < q.length; i++) {
    if (q[i]._id === id.toString()) {
      return i;
    }
  }
  return -1;
});

const searchFault = new CronJob('*/10 * * * * *', () => {
  console.log("--------------------------------------");
  console.log('Recebidos: ');
  console.log(received_pkgs);
  console.log('Enviados: ');
  console.log(send_pkgs);
  console.log('Vizinhos: ');
  console.log(neighboors);
  console.log('Impostores: ');
  console.log(impostores);
  console.log("--------------------------------------");
  received_pkgs.forEach(rec => {
    send_pkgs.forEach(sen => {
      if (rec.source_id === sen.destination_id && rec.message !== sen.message) {
        neighboors.forEach(neighboor => {
          if (rec.source_id === neighboor.index) {
            if (neighboor.message === rec.message) {
              let info = searchMessageRec(neighboor.source_id);
              if (info !== neighboor.message) {
                impostores.push(neighboor.source_id);
              } else {
                impostores.push(params.id);
              }
            } else {
              impostores.push(neighboor.index);
            }
          }
        });
      }
    })
  });
}, null, true, 'America/Sao_Paulo');

function searchMessageRec(id) {
  for (let i = 0; i < received_pkgs.length; i++) {
    if (received_pkgs[i].source_id === id) {
      return received_pkgs[i].message;
    }
  }
  return null;
}

const job = new CronJob('*/5 * * * * *', () => {
  queue.forEach(pkg => {
    pkg.received_pkgs = received_pkgs;
    let buffer = JSON.stringify(pkg);
    server.send(buffer, 0, buffer.length, pkg.port, pkg.hostname);
    return;
  });
}, null, true, 'America/Sao_Paulo');

server.on('listening', () => {
  let address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  try {
    let pkg = JSON.parse(message);
    received_pkgs.push({
      source_id: pkg.source_id,
      message: pkg.message
    });
    pkg.received_pkgs = received_pkgs;
    console.log(`\nMessage received from ${remote.address}:${remote.port}`);
    console.log(`Packet info: ${JSON.stringify(pkg)}`);

    pkg.send_pkgs.forEach(p => {
      neighboors.push({
        index: p.destination_id,
        source_id: pkg.source_id,
        message: p.message
      });
    });

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

function main(militaries, links) {
  this_node = militaries.filter(m => m.id === params.id);
  this_neighboors = militaries.filter(m => m.id !== params.id);
  my_links = links.filter(l => l.source === params.id);
  my_links.forEach(link => {
    destination = militaries.filter(m => m.id === link.destination);
    let pkg = packet.create(params.id, destination[0].id, destination[0].host, destination[0].port, link.message, send_pkgs, received_pkgs);
    queue.push(pkg);
    send_pkgs.push({
      destination_id: pkg.destination_id,
      message: pkg.message
    });
  });
  console.table(queue);
}

server.bind(params.port, params.host);