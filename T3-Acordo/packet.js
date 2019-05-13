const shortid = require('shortid');

module.exports.create = ((source_id, destination_id, host, port, msg, send_pkgs, received_pkgs) => {
  return {
    _id: shortid.generate(),
    source_id: source_id,
    destination_id: destination_id,
    host: host,
    port: port,
    message: msg,
    send_pkgs: send_pkgs,
    received_pkgs: received_pkgs
  };
});