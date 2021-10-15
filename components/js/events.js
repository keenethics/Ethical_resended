let router = require('express').Router();
const keySet = require('../../constants.json');
const requests = require('./requests');
const appHome = require('../json/appHome.json');

function verifyURL(response, challenge) {
    response.type('application/x-www-form-urlencoded');
    response.send(challenge);
    response.end();
}

function openAppHome(response, user_id) {
    requests.viewPublish(user_id, appHome, keySet.SLACK_BOT_TOKEN);
    response.status(200);
    response.end();
}

router.post('/', (req, res, next) => {
    try {
        if(req.body.type === 'url_verification') {
            verifyURL(res, req.body.challenge);
        } else if(req.body.event.type === 'app_home_opened'){
            openAppHome(res, req.body.event.user);
        }
        
    } catch (error) {
        console.log(error);
    }
});

module.exports.eventRouter = router;