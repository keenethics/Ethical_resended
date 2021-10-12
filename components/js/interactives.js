let router = require('express').Router();
const handlers = require('./modals/handlers');
const db = require('./db');

function handleShortcuts(payload) {
    if(payload.callback_id === 'repeat_send_action') {
        handlers.handleShortcut(payload);
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
            payload.user = user
        } else {
            //throw error?
            throw new Error("Not authorized!");
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

module.exports.interactivityRouter = router;