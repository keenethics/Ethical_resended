const axios = require('axios');
const qs = require('qs');

module.exports.loadUsers = async (team_id, token) => {
    let users = await axios.post(
        'https://slack.com/api/users.list', 
        qs.stringify({
            token: token,
            team_id: team_id
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            }
        }
    );
    if(users.data.ok) {
        return users.data.members.filter((user) => {
            return !user.is_bot && ( user.id !== 'USLACKBOT');
        });
    } else {
        throw new Error("Could not load users");
    }
}

module.exports.loadChannels = async (team_id, token) => {
    let channels = await axios.post(
        'https://slack.com/api/conversations.list', 
        qs.stringify({
            token: token,
            team_id: team_id
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`
            }
        }
    );
        
    if(channels.data.ok) {
        return channels.data.channels;
    } else {
        throw new Error("Could not load users");
    }
}

module.exports.loadChannelMembers = async (channel_id) => {
    console.log(`Channel id: ${channel_id}`);
    let members = []
    let cursor = 'not empty';
    while(cursor) {
        let payload = await axios.post(
            'https://slack.com/api/conversations.members', 
            qs.stringify({
                token: token,
                channel: channel_id
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        cursor = payload.data.response_metadata.next_cursor;
        members.push(...payload.data.members);
    }
    return members;
}
