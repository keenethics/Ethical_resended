let router = require('express').Router();
const handlers = require('./modals/handlers');
const db = require('./db');

function handleShortcuts(payload) {
    if(payload.callback_id === 'resend_message') {
        handlers.handleShortcut({
            trigger_id: payload.trigger_id,
            team_id: payload.user.team_id,
            team_domain: payload.team.domain,
            text: payload.message.text
        });
    } else if (payload.callback_id === 'resend_message_slash') {
        handlers.handleShortcut({
            trigger_id: payload.trigger_id,
            team_id: payload.team_id,
            team_domain: payload.team_domain,
            text: payload.text
        });
    }
}

function handleSubmission(payload) {
    if(payload.view.callback_id === 'selector_modal_submit') {
        handlers.handleShortcutSubmit(payload);
    }
}

router.post('/', async (req, res, next) => {
    try {
        let payload = JSON.parse(req.body.payload);
        res.status(200);
        res.end();
        let user = await db.get(
            {
                user_id: payload.user.id, 
                team_id: payload.user.team_id
            });
        
        if(user) {
            payload.user = user;
        } else {
            if(payload.type !=='block_actions') console.log("Not authorized!");
            return;
        }

        if(payload.type === 'message_action') {
            handleShortcuts(payload);
        } else if(payload.type === 'view_submission') {
            handleSubmission(payload);
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/slash', async (req, res, next) => {
    try {
        let body = req.body;
        res.status(200);
        res.end();
        
        let user = await db.get(
            {
                user_id: body.user_id, 
                team_id: body.team_id
            });
        
        if(!user) {
            console.log("Not authorized!");
            return;
        }

        if(body.command === '/resend') {
            body.callback_id = 'resend_message_slash';
            handleShortcuts(body);
        }
    } catch (error) { console.log(error); }
})

module.exports.interactivityRouter = router;