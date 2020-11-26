const moment = require('moment');

function generateMessage(username, text) {
    return {
        username,
        text,
        time:  moment().format('h:mm a')
    }
}

module.exports = generateMessage