const loaders = require('../loaders');
const requests = require('../requests');

module.exports.extractSelectors = (sender_selection, target_selection) => {
    let post_as_bot = sender_selection.value === 'send_as_bot';
    let allow_restricted = ['send_to_all', 'send_to_restricted'].indexOf(
        target_selection.value ) > -1;
        
    let allow_members = ['send_to_all', 'send_to_members'].indexOf(
            target_selection.value ) > -1;
    return [post_as_bot, allow_restricted, allow_members];
}

module.exports.extractIds = (selected_options, checkboxes) => {
    let users = [];
    let channels = [];
    let [team, schedule] = [false, false];

    checkboxes.forEach((checkbox) => {
        if(checkbox.value === 'send_to_team') team = true;
        else if (checkbox.value === 'schedule_message') schedule=true;
    })

    selected_options.forEach(element => {
        if(element[0] === 'U') {
            users.push(element);
        } else if(element[0] === 'C') {
            channels.push(element);
        }
    });
    return [users, channels, team, schedule];
}

module.exports.extractDateTime = (datetime) => {
    let date = datetime.date.selected_date;
    let time = datetime.time.selected_time;

    if(!(date && time)) throw new Error('Bad Datetime!')
    let new_datetime = new Date(date + ' ' + time)

    if((new Date()) > new_datetime) throw new Error('Selected datetime is in the past!')
    return new_datetime
}

module.exports.getUserset = async (
    team_id, user_id, token, allow_restricted, allow_members
    ) => {
    let user_ids = new Set();

    await loaders.loadUsers(team_id, token).then(loaded_users => {
        loaded_users.forEach((user) => {
            if(user.id === user_id) {
                return;
            } else {
                if(user.is_restricted || user.is_ultra_restricted) {
                    if(allow_restricted) user_ids.add(user.id);
                } else {
                    if(allow_members) user_ids.add(user.id);
                }
            }   
        });
    });
    return user_ids;
}

module.exports.intersectSets = async (channels, users, user_set, token) => {
    let buffer = [];

    let channel_members = await Promise.all( channels.map(async (channel) => {
        return await loaders.loadChannelMembers(channel, token);
    }))

    channel_members.forEach((usergroup) => users.push(...usergroup));
    
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

module.exports.scheduleMessages = async (user_set, token, message, time) => {
    let success_counter = 0;
    let error_users = [];
    user_set = Array.from(user_set);

    let responses = await Promise.all(user_set.map((user_id) => {
        return requests.scheduleMessage(token, user_id, message, time);
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

module.exports.confirmSending = async (bot_token, user_id, results, schedule) => {
    let action = schedule ? 'заплановано' : 'надіслано';

    if(results[1].length !== 0) {
        results[1] = results[1].map((user_id) => `<@${user_id}>`)
        var res = await requests.postMessage(
            bot_token, user_id, 
            (`Успішно ${action} ${results[0]} повідомлень, не вдалося` + 
             ` надіслати повідомлення цим користувачам: ${results[1].join(', ')}`)
        );
    } else {
        var res = await requests.postMessage(
            bot_token, user_id, 
            `Успішно ${action} ${results[0]} повідомлень`
        );
    }
    
    if(!res.data.ok) {
        res.data.request = 'Confirm Sending';
        console.log(JSON.stringify(res.data, undefined, 2));
    }
}