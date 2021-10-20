const loaders = require('../loaders');
const requests = require('../requests');

module.exports.extractCheckboxes = (selected_options) => {
    let post_as_bot = false;
    let allow_restricted = false;

    selected_options.forEach((checkbox) => {
        if(checkbox.value === 'send_as_bot') {
            post_as_bot = true;
        } else if(checkbox.value === 'send_to_restricted_users') {
            allow_restricted = true;
        }
    });

    return [post_as_bot, allow_restricted];
}

module.exports.extractIds = (selected_options) => {
    let users = [];
    let channels = [];
    let team = false;

    selected_options.forEach(element => {
        if(element.value[0] === 'U') {
            users.push(element.value);
        } else if(element.value[0] === 'C') {
            channels.push(element.value);
        } else if(element.value[0] === 'T') {
            team = true;
        }
    });
    return [users, channels, team];
}

module.exports.getUserset = async (team_id, user_id, allow_restricted) => {
    let user_ids = new Set();

    await loaders.loadUsers(team_id).then(loaded_users => {
        loaded_users.forEach((user) => {
            if(user.id === user_id) {
                return;
            } else if(  allow_restricted || 
                        (!user.is_restricted && !user.is_ultra_restricted)) {
                user_ids.add(user.id);
            }
        });
    });
    return user_ids;
}

module.exports.intersectSets = async (channels, users, user_set) => {
    let buffer = [];

    channels.forEach(async (channel) => {
        let channel_members = await loaders.loadChannelMembers(channel);
        users.push(...channel_members);
    });
    users.forEach((user_id) => {
        if(user_set.has(user_id)) buffer.push(user_id);
    });

    return new Set(buffer);
} 

module.exports.postMessages = async (user_set, token, message) => {
    let success_counter = 0;
    let error_users = [];
    user_set = Array.from(user_set);

    let responses = await Promise.all(user_set.map((user_id) => {
        return requests.postMessage(token, user_id, message);
    }));

    responses.forEach( (res, idx) => {
        if(res.data.ok) {
            success_counter += 1;
        } else {
            error_users.push(user_set[idx]);
        }
    });

    return [success_counter, error_users];
}

module.exports.confirmSending = async (bot_token, user_id, results) => {
    if(results[1].length !== 0) {
        results[1] = results[1].map((user_id) => `<@${user_id}>`)
        var res = await requests.postMessage(
            bot_token, user_id, 
            (`Успішно надіслано ${results[0]} повідомлень, не вдалося` + 
             ` надіслати повідомлення цим користувачам: ${results[1].join(', ')}`)
        );
    } else {
        var res = await requests.postMessage(
            bot_token, user_id, 
            `Успішно надіслано ${results[0]} повідомлень`
        );
    }
}