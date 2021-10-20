const db = require('./postgres');

// Change to mongoDB if you like (not suited for production)
// const db = require('./mongo'); 

module.exports.get = db.get;
module.exports.set = db.set;
module.exports.delete = db.delete;