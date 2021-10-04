const db = require('monk')('localhost/slackResender');
const credentials = db.get('credentials');

module.exports.get = (query) => {
    return credentials.find(query);
}

module.exports.set = (obj) => {
    return credentials.insert(obj);
}

module.exports.delete = (query) => {
    return credentials.remove(query);
}