const shortid = require('shortid');

module.exports.create = ((host, port, msg, vector) => {
  return { _id: shortid.generate(), host, port, msg, vector };
});