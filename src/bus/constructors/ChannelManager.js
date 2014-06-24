var _ = require('underscore');
var cfg = require('../config');
var Subscription = require('./Subscription');

function ChannelManager () {
    var args = [].slice.call(arguments);

    this._channels  = {};

    this.addChannel(cfg.DEFAULT_CHANNEL);
    this.init(args);
}

/**
 * Initialize the channel manager, creating any channels passed into
 * the constructor;
 *
 * @param   {array} args
 * @return  {void}
 */
ChannelManager.prototype.init = function (args) {
    var channels = _.isArray(args[0]) ? args[0] : args;

    for (var i = 0, len = channels.length; i < len; i += 1) {
        this.addChannel(channels[i]);
    }
};

/**
 * Add a channel
 *
 * @param {string} channel
 * @return {object}
 */
ChannelManager.prototype.addChannel = function (channel) {

    if (!this._channels.hasOwnProperty(channel)) {
       this._channels[channel] = {};
    }

    return this;
};

/**
 * Add a channel subscription
 *
 * @param {Subscription} sub
 */
ChannelManager.prototype.addChannelSubscription = function (sub) {

    if (!sub instanceof Subscription) {
        throw new Error(cfg.strings.ERROR_INVALID_SUBSCRIPTION);
    }

    // add channel if it doesnt exist
    if (!this._channels[sub.channel]) {
        this._channels[sub.channel] = {};
    }

    // add topic if it doesnt exist
    if (!this._channels[sub.channel][sub.topic]) {
        this._channels[sub.channel][sub.topic] = {};
    }

    // add subscriber if it doesnt exist
    if (!this._channels[sub.channel][sub.topic][sub.subscriberId]) {
        this._channels[sub.channel][sub.topic][sub.subscriberId] = [];
    }

    this._channels[sub.channel][sub.topic][sub.subscriberId].push(sub.callback);
};

/**
 * Returns all channels
 */
ChannelManager.prototype.getChannels = function () {
    return this._channels;
};

module.exports = ChannelManager;
