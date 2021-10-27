const db = require('./databases/postgres');

// Change to mongoDB if you like (currently not suited for production)
// const db = require('./databases/mongo'); 

module.exports.get = db.get;
module.exports.set = db.set;
module.exports.delete = db.delete;