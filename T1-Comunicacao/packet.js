const shortid = require('shortid');

module.exports.create = ((host, port, msg) => {
  return { _id: shortid.generate(), host, port, msg };
});