var cfg = require('../config');
var Subscription = require('./Subscription');

function SubscriberFactory (channels) {
    this.channels = channels;
}

SubscriberFactory.prototype.create = function (obj) {
    var subscription;

    if (!obj.topic || !obj.callback || !obj.subscriberId) {
        throw new Error(cfg.strings.ERROR_INVALID_SUBSCRIPTION);
    }

    if (typeof obj.callback !== 'function') {
        throw new Error(cfg.strings.ERROR_INVALID_CALLBACK);
    }

    if (obj.channel && typeof obj.channel !== 'string') {
        throw new Error(cfg.strings.ERROR_INVALID_CHANNEL);
    }

    //this.channels.add(subscription);

    subscription = new Subscription(obj);

};

module.exports = SubscriberFactory;
