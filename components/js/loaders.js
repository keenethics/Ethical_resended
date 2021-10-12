const axios = require('axios');
const qs = require('qs');
const keyset = require('../../constants.json');

module.exports.loadUsers = async (team_id) => {
    let users = await axios.post(
        'https://slack.com/api/users.list', 
        qs.stringify({
            token: keyset.SLACK_BOT_TOKEN,
            team_id: team_id
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${keyset.SLACK_BOT_TOKEN}`
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

module.exports.loadChannels = async (team_id) => {
    let channels = await axios.post(
        'https://slack.com/api/conversations.list', 
        qs.stringify({
            token: keyset.SLACK_BOT_TOKEN,
            team_id: team_id
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${keyset.SLACK_BOT_TOKEN}`
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
                token: keyset.SLACK_BOT_TOKEN,
                channel: channel_id
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${keyset.SLACK_BOT_TOKEN}`
                }
            }
        );
        cursor = payload.data.response_metadata.next_cursor;
        members.push(...payload.data.members);
    }
    return members;
}
