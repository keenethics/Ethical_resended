const keyset = require('../../../constants.json');
const builder = require('./selectorModalBuilder');
const requests = require('../requests');
const submitHandlers = require('./submitHandlers');

module.exports.handleShortcut = async (payload) => {
    let resender_modal = await builder.buildSelector(payload)
                            .catch(error => console.log(error));
    requests.viewOpen(
        payload.trigger_id, 
        resender_modal, 
        keyset.SLACK_BOT_TOKEN
    );
}

module.exports.handleShortcutSubmit = async (payload) => {
    let message = payload.view.state.values.message_block.writing_action.value;
    let blocks = payload.view.state.values;
    let [post_as_bot, allow_restricted] = submitHandlers.extractCheckboxes(
        blocks.checkboxes_block.checkboxes_action.selected_options
    );
    let [users, channels, team] = submitHandlers.extractIds(
        blocks.selector_block.selection_action.selected_options
    );
    let user_set = await submitHandlers.getUserset(
        payload.team.id, payload.user.user_id, allow_restricted
    );

    user_set = team ? user_set : await submitHandlers.intersectSets(
        channels, users, user_set
    );

    let token = post_as_bot ? 
        keyset.SLACK_BOT_TOKEN : payload.user.user_access_token;

    let count = await submitHandlers.postMessages(user_set, token, message);
    submitHandlers.confirmSending(
        keyset.SLACK_BOT_TOKEN, payload.user.user_id, count
    );
}