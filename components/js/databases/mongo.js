const db = require('monk')('localhost/slackResender');
const credentials = db.get('credentials');

module.exports.get = (team_id, user_id=null) => {
    if(user_id) return credentials.findOne({user_id: user_id, team_id: team_id})
    else return credentials.findOne({team_id: team_id})
}

module.exports.set = (newRow) => {
    return credentials.insert(newRow);
}

module.exports.delete = (user_id, team_id) => {
    return credentials.remove({user_id: user_id, team_id: team_id});
}