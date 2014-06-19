var config = require('../config');
var _ = require('underscore');

function Envelope (message) {

    if (!message || !message.topic || typeof message.topic !== 'string') {
        throw new Error('An invalid envelope was received');
    }

    this.envelope = _.extend({
        channel: config.DEFAULT_CHANNEL,
        timestamp: new Date()
    }, message);

    return this.envelope;

}

module.exports = Envelope;
