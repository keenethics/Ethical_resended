const selector_modal = require('../../json/selector_modal.json');
const loaders = require('../loaders');

module.exports.buildSelector = async (parameters) => {
    let users = await loaders.loadUsers(parameters.team_id)
                             .catch((error) => console.log(error));
    let channels =  await  loaders.loadChannels(parameters.team_id)
                                    .catch((error) => console.log(error));

    let modal = {};
    Object.assign(modal, selector_modal);
    modal.blocks[0].element.initial_value = parameters.text;
    let groups = [];
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
    if(channels.length) {groups.push({
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
    groups.push({
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
    });
    modal.blocks[2].accessory.option_groups = groups;
    return modal;
}
