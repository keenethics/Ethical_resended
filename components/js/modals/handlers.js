const requests = require('../requests');
const submitHandlers = require('./submitHandlers');
const main_modal = require('../../json/main_modal.json');

module.exports.handleShortcut = async (parameters) => {
    main_modal.blocks[0].element.initial_value = parameters.text;
    let resender_modal = main_modal;

    requests.viewOpen(
        parameters.trigger_id, 
        resender_modal, 
        parameters.bot_token
    );
}

module.exports.handleShortcutSubmit = async (payload) => {
    let blocks = payload.view.state.values;
    let message = blocks.message_block.writing_action.value;
    let [post_as_bot, allow_restricted, allow_members] = submitHandlers.extractSelectors(
        blocks.sender.select_action.selected_option,
        blocks.target.select_action.selected_option,
    );
    
    let [users, channels, team, schedule] = submitHandlers.extractIds(
        blocks.receivers_block.receivers.selected_conversations,
        blocks.workspace.checkbox.selected_options
    );
     
    let user_set = await submitHandlers.getUserset(
        payload.team.id, payload.user.user_id, payload.user.bot_access_token, 
        allow_restricted, allow_members
    );

    user_set = team ? user_set : await submitHandlers.intersectSets(
        channels, users, user_set, payload.user.user_access_token
    );

    let token = post_as_bot ? 
        payload.user.bot_access_token : payload.user.user_access_token;
    
    let result = []
    if(schedule) {
        let time = submitHandlers.extractDateTime(blocks.datetime);
        result = await submitHandlers.scheduleMessages(user_set, token, message, time);
    } else {
        result = await submitHandlers.postMessages(user_set, token, message);
    }
    // submitHandlers.confirmSending(
    //     payload.user.bot_access_token, payload.user.user_id, result, schedule
    // );
}