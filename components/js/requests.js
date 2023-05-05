const axios = require('axios');
const qs = require('qs');

module.exports.postMessage = async (token, channel, message) => {
    return await axios.post(
        'https://slack.com/api/chat.postMessage',
        qs.stringify({
            token,
            channel,
            text: message
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    ).catch((error) => console.log(['PostMessage', error]));
}

module.exports.scheduleMessage = async (token, channel, message, time) => {
    time = process.env.NODE_ENV === 'production' ? 
        time.getTime() - 7200000 : time.getTime();
        
    return await axios.post(
        'https://slack.com/api/chat.scheduleMessage',
        qs.stringify({
            token,
            channel,
            text: message,
            post_at: time / 1000 | 0
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
            trigger_id,
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
        response.data.request = 'View open';
        console(JSON.stringify(response.data, undefined, 2));
    }

    return response;
}

module.exports.viewPublish = async (user_id, modal, token) => {
    
    let response = await axios.post(
        'https://slack.com/api/views.publish', 
        JSON.stringify({
            user_id,
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
        response.data.request = 'View publish';
        console(JSON.stringify(response.data, undefined, 2));
    }

    return response;
}

module.exports.response_to_hook = async (response_url, text) => { 
    let response = await axios.post(
        response_url, 
        JSON.stringify({
            text
        }),
        {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }
        );

    if(!response.data.ok) {
        response.data.request = 'Response to hook';
        console.log(JSON.stringify(response.data, undefined, 2));
    }
}

module.exports.revokeToken = async (token) => {
    let response = await axios.post(
        'https://slack.com/api/auth.revoke',
        qs.stringify({
            token
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

    if(!response.data.ok) {
        response.data.request = 'Revoke token';
        console.log(JSON.stringify(response.data, undefined, 2));
    }
}