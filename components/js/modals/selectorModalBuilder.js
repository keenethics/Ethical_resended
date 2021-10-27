const selector_modal = require('../../json/selector_modal.json');
const loaders = require('../loaders');

module.exports.buildSelector = async (parameters) => {
    
    let [users, channels] = await Promise.all([
        loaders.loadUsers(parameters.team_id, parameters.bot_token),
        loaders.loadChannels(parameters.team_id, parameters.user_token)
    ]).catch((error) => console.log(error));
    
    users = users.filter((user) => user.id !== parameters.user_id);

    let modal = {};
    let groups = [{
        label: {
            type: "plain_text",
            text: "Команди",
        },
        options: [{
            text: {
                type: "plain_text",
                text: parameters.team_domain
            },
            value: parameters.team_id
        }]
    }];
    
    if(channels.length) { groups.push({
        label: {
            type: "plain_text",
            text: "Канали",
        },
        options: channels.map((channel) => {
            return {
                text: {
                    type: "plain_text",
                    text: channel.name
                },
                value: channel.id
            }
        })
    })}

    if(users.length) {groups.push({
        label: {
            type: "plain_text",
            text: "Користувачі"
        },
        options: users.map((user) => {
            return {
                text: {
                    type: "plain_text",
                    text: user.profile.display_name
                },
                value: user.id
            }
        })
    })}
    Object.assign(modal, selector_modal);
    modal.blocks[0].element.initial_value = parameters.text;
    modal.blocks[2].accessory.option_groups = groups;
    return modal;
}
