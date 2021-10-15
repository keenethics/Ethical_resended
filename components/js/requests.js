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
    ).catch((error) => console.log(error));
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

    if(!response.data.ok) console.log(response.data);

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

    if(!response.data.ok) console.log(response.data);

    return response;
}