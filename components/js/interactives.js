let router = require('express').Router();
const handlers = require('./modals/handlers');
const requests = require('./requests');
const db = require('./db');

function handleShortcuts(payload) {
    if(payload.callback_id === 'resend_message') {
        handlers.handleShortcut({
            trigger_id: payload.trigger_id,
            bot_token: payload.user.bot_access_token,
            text: payload.message.text
        });
    } else if (payload.callback_id === 'resend_message_slash') {
        handlers.handleShortcut({
            trigger_id: payload.trigger_id,
            bot_token: payload.bot_access_token,
            text: payload.text
        });
    }
}

function handleSubmission(payload) {
    if(payload.view.callback_id === 'selector_modal_submit') {
        handlers.handleShortcutSubmit(payload);
    }
}

function handleRevoke(payload) {
    if(payload.actions[0].action_id === 'action_delete') {
        requests.revokeToken(
            payload.user.user_access_token
            ).then(res => {
                db.delete(
                    payload.user.user_id,
                    payload.user.team_id,
                    );
            }
            ).catch(error => console.log(['Revoke', error]));
    }
}

router.post('/', async (req, res, next) => {
    try {
        let payload = JSON.parse(req.body.payload);
        res.status(200);
        res.end();
        let user = await db.get(payload.user.team_id, payload.user.id);
        
        if(user) {
            payload.user = user;
        } else {
            if(payload.type !== 'block_actions') {
                requests.response_to_hook( 
                    payload.response_url, 
                    'Щоб виконати цю дію, будь ласка, ' +
                    'встановіть цього бота з його домашньої сторінки')
                }
            return;
        }

        if(payload.type === 'message_action') handleShortcuts(payload);
        else if(payload.type === 'view_submission') handleSubmission(payload);
        else if(payload.type === 'block_actions') handleRevoke(payload);

    } catch (error) {
        console.log(error);
    }
});

router.post('/slash', async (req, res, next) => {
    try {
        let body = req.body;
        res.status(200);
        res.end();
        
        let user = await db.get(body.team_id, body.user_id);
        
        if(!user) {
            requests.response_to_hook(
                    body.response_url, 
                    'Щоб виконати цю дію, будь ласка, ' +
                    'встановіть цього бота з його головної сторінки');
            return;
        }

        if(body.command === '/resend') {
            body.callback_id = 'resend_message_slash';
            body.bot_access_token = user.bot_access_token;
            handleShortcuts(body);
        }
    } catch (error) { console.log('Slash error: ', error); }
})

module.exports.interactivityRouter = router;