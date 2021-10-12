const selector_modal = require('../../json/selector_modal.json');
const loaders = require('../loaders');

module.exports.buildSelector = async (payload) => {
    let users = await loaders.loadUsers(payload.user.team_id)
                             .catch((error) => console.log(error));
    let channels =  await  loaders.loadChannels(payload.user.team_id)
                                    .catch((error) => console.log(error));

    let modal = {};
    Object.assign(modal, selector_modal);
    modal.blocks[0].element.initial_value = payload.message.text;
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
                text: payload.team.domain
            },
            value: payload.team.id
        }]
    });
    modal.blocks[1].accessory.option_groups = groups;
    return modal;
}
