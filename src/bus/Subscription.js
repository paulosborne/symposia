var cfg = require('../config');
var _ = require('underscore');

function Subscription (obj) {
    this.channel = cfg.DEFAULT_CHANNEL;
    this.timestamp = new Date();

    return _.extend(this, obj);
}

module.exports = Subscription;
