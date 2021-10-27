const axios = require('axios');
const qs = require('qs');

module.exports.loadUsers = async (team_id, token) => {
    let users = [];
    let cursor = null;
    do {
        let payload = await axios.post(
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

        if(!payload.data.ok) throw new Error('Could not load users'); 
        cursor = payload.data.response_metadata.next_cursor;
        users.push(...payload.data.members);
    } while (cursor);
    
    return users.filter((user) => {
        return !user.is_bot && ( user.id !== 'USLACKBOT');
    });
}

module.exports.loadChannels = async (team_id, token) => {
    let channels = [];
    let cursor = null;
    
    do {
        let payload = await axios.post(
            'https://slack.com/api/conversations.list', 
            qs.stringify({
                token: token,
                team_id: team_id,
                types: 'public_channel,private_channel'
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if(!payload.data.ok) throw new Error('Could not load channels');
        cursor = payload.data.response_metadata.next_cursor;
        channels.push(...payload.data.channels);
    } while(cursor)

    return channels;
}

module.exports.loadChannelMembers = async (channel_id, token) => {
    let members = [];
    let cursor = null;
    do {
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
        if(!payload.data.ok) throw new Error('Could not load channel members');
        members.push(...payload.data.members);
    } while(cursor);

    return members;
}
