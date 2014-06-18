var config = require('./config');

function SymposiaMediator(symposia) {
    this.modules = {};
    this.subscriptions = {};

    if (!symposia) {
        throw new Error('A valid object is expected');
    }


}

SymposiaMediator.prototype.publish = function () {
    return true;
};

/**
 * Create a new subscription
 *
 * @param {object} subscription - the subscription definition
 * @return {object}
 */
SymposiaMediator.prototype.subscribe = function (subscription) {
    var channel, topic, id, callback;

    if (!subscription.topic || !subscription.callback || !subscription.subscriberId) {
        throw new Error('A valid subscription definition was expected');
    }

    if (typeof subscription.callback !== 'function') {
        throw new Error('A valid callback function must be provided');
    }

    if (typeof subscription.channel !== 'string') {
        throw new Error('A valid channel must be supplied');
    }

    channel     = subscription.channel || config.DEFAULT_CHANNEL;
    topic       = subscription.topic;
    id          = subscription.subscriberId;
    callback    = subscription.callback;

    // create channel & topic objects if they dont exist
    this.subscriptions[channel] = this.subscriptions[channel] || {};
    this.subscriptions[channel][topic] = this.subscriptions[channel][topic] || {};

    // create an array to hold all callbacks from the subscriber
    this.subscriptions[channel][topic][id] = this.subscriptions[channel][topic][id] || [];
    this.subscriptions[channel][topic][id].push(callback);

    return this.subscriptions;
};

SymposiaMediator.prototype.unsubscribe = function () {

};

SymposiaMediator.prototype.start = function () {

};

SymposiaMediator.prototype.stop = function () {

};

SymposiaMediator.prototype.destroy = function () {

};

SymposiaMediator.prototype.create = function (name, fn, options) {

};

SymposiaMediator.prototype.getSubscriptions = function () {
    return this.subscriptions;
};

SymposiaMediator.prototype.getModules = function () {
    return this.modules;
};

module.exports = SymposiaMediator;
