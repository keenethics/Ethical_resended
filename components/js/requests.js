const axios = require('axios');
const qs = require('qs');

module.exports.postMessage = async (token, channel, message) => {
    return await axios.post(
        'https://slack.com/api/chat.postMessage',
        qs.stringify({
            token: token,
            channel: channel,
            text: message
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    ).catch((error) => console.log(['PostMessage', error]));
}

module.exports.viewOpen = async (trigger_id, modal, token) => { 
    let response = await axios.post(
        'https://slack.com/api/views.open', 
        JSON.stringify({
            trigger_id: trigger_id,
            view: modal
        }),
        {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${token}`
            }
        }
        ).catch(
            (error) => console.log(error)
        );

    if(!response.data.ok) console.log(['View.open', response.data]);

    return response;
}

module.exports.viewPublish = async (user_id, modal, token) => {
    
    let response = await axios.post(
        'https://slack.com/api/views.publish', 
        JSON.stringify({
            user_id: user_id,
            view: modal
        }),
        {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${token}`
            }
        }
        ).catch(
            (error) => console.log(error)
        );

    if(!response.data.ok) {
        response.data.request = 'View publish'
        console.log(response.data);
    }

    return response;
}

module.exports.response_to_hook = async (response_url, text) => { 
    let response = await axios.post(
        response_url, 
        JSON.stringify({
            text: text
        }),
        {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }
        );

    if(!response.data.ok) {
        response.data.request = 'Response to hook'
        console.log(response.data);
    }
}

module.exports.revokeToken = async (token) => {
    let response = await axios.post(
        'https://slack.com/api/auth.revoke',
        qs.stringify({
            token: token
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

    if(!response.data.ok) {
        response.data.request = 'Revoke token'
        console.log(response.data);
    }
}