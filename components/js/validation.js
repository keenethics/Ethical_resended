const crypto = require('crypto');
require('dotenv').config();

module.exports.slackVerifyingMiddleware = (req, res, buf, encoding) => {
    let body = buf;
    let timestamp = parseInt(req.headers['x-slack-request-timestamp']);
    let diff =  ((+ new Date()) / 1000) - timestamp;
    if( diff > 5 * 60 ) throw new Error("Too old request");

    let sig_basestring = 'v0:' + timestamp + ':' + body;
    let code = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
                     .update(sig_basestring).digest('hex');

    if(!('v0=' + code === req.headers['x-slack-signature'])) {
        throw new Error('Could not verify request');
    }
}