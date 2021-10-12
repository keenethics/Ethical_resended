const axios = require('axios');
const qs = require('qs');
const keyset = require('../../constants.json');
const db = require('./db');
let router = require('express').Router();

router.get("/add", (req, res, next) => {
    res.write(
        '<a href="https://slack.com/oauth/v2/authorize?client_id=2525673614807.2564081677856' +
        '&scope=channels:history,channels:read,chat:write,commands,im:history,im:read,im:write,' + 
        'users:read&user_scope=chat:write"><img alt="Add to Slack" height="40" width="139" ' + 
        'src="https://platform.slack-edge.com/img/add_to_slack.png" ' + 
        'srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, ' + 
        'https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>'
    );
    res.end();
});

router.get("/direct", (req, res, next) => {
    res.redirect(
        'https://slack.com/oauth/v2/authorize?client_id=2525673614807.2564081677856' + 
        '&scope=channels:history,channels:read,chat:write,commands,im:history,im:read,' + 
        'im:write,users:read&user_scope=chat:write'
    );
    res.end();
});

router.get("/thanks", (req, res, next) => {
    res.write("Thanks for installing!");
    res.end();
});

router.get("/oauth_redirect", (req, res, next) => {
    let code = req.query.code;
    let state = req.query.state;

    let body = {
        client_id: keyset.SLACK_CLIENT_ID,
        client_secret: keyset.SLACK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
    }
    
    return axios.post('https://slack.com/api/oauth.v2.access', qs.stringify(body), {
        "Content-Type": "application/x-www-form-urlencoded"
    }).then(async result => {
        result = result.data
        if(result.ok) {
            let previous_attempts = await db.get({ 
                    user_id: result.authed_user.id, 
                    team_id: result.team.id
                });
            if(!previous_attempts) {
                db.set({
                    user_id: result.authed_user.id,
                    user_access_token: result.authed_user.access_token,
                    bot_user_id: result.bot_user_id,
                    bot_access_token: result.access_token,
                    team_id: result.team.id,
                    team_name: result.team.name
                });
            }
            res.redirect("./thanks");
            res.end();
        } else {
            throw new Error('Auth flow was ruined!');
        }
        res.end();
    }).catch(error => {
        console.log(error);
    });
});

module.exports.authRouter = router;