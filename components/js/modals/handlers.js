const builder = require('./selectorModalBuilder');
const requests = require('../requests');
const submitHandlers = require('./submitHandlers');

module.exports.handleShortcut = async (parameters) => {
    let resender_modal = await builder.buildSelector(parameters)
                            .catch(error => console.log(error));
    
    requests.viewOpen(
        parameters.trigger_id, 
        resender_modal, 
        parameters.bot_token
    );
}

module.exports.handleShortcutSubmit = async (payload) => {
    let message = payload.view.state.values.message_block.writing_action.value;
    let blocks = payload.view.state.values;
    let [post_as_bot, allow_restricted, allow_members] = submitHandlers.extractCheckboxes(
        blocks.sender.select_action.selected_option,
        blocks.target.select_action.selected_option,
    );
    let [users, channels, team] = submitHandlers.extractIds(
        blocks.selector_block.selection_action.selected_options
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

    let result = await submitHandlers.postMessages(user_set, token, message);
    submitHandlers.confirmSending(
        payload.user.bot_access_token, payload.user.user_id, result
    );
}