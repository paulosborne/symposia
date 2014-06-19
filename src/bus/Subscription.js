var cfg = require('../config');
var _ = require('underscore');

function Subscription (obj) {

    if (!obj || !obj.topic || !obj.callback || !obj.subscriberId) {
        throw new Error(cfg.strings.ERROR_INVALID_SUBSCRIPTION);
    }

    if (typeof obj.callback !== 'function') {
        throw new Error(cfg.strings.ERROR_INVALID_CALLBACK);
    }

    if (obj.channel && typeof obj.channel !== 'string') {
        throw new Error(cfg.strings.ERROR_INVALID_CHANNEL);
    }

    this.channel = cfg.DEFAULT_CHANNEL;
    this.timestamp = new Date();

    return _.extend(this, obj);
}

module.exports = Subscription;
