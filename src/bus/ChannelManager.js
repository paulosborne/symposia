var _ = require('underscore');
var cfg = require('../config');

function ChannelManager () {
    var args = [].slice.call(arguments);

    this._channels  = {};
    this._chaining  = false;
    this._chain     = [];

    this.add(cfg.DEFAULT_CHANNEL);
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
        this.add(channels[i]);
    }
};

ChannelManager.prototype._ = function (channel) {
    this._chaining = true;
    this._chain.push(channel);

    return this.add(channel);
};

ChannelManager.prototype.topic = function (topic, channel) {
    channel = this._chaining ? this._chain[0] : channel;

    if (this._chaining) {
        this._chain.push(topic);
        return this;
    }
};

ChannelManager.prototype.value = function () {
    var chain = this._chain;
    var last = chain.length - 1;
    var prev;
    
    if (!this._chaining) return;

    this._chaining = false;

    return chain[last];
};

/**
 * Add a channel
 *
 * @param {string} channel
 * @return {object}
 */
ChannelManager.prototype.add = function (channel) {

    if (!this._channels.hasOwnProperty(channel)) {
       this._channels[channel] = {};
    }

    return this;
};

ChannelManager.prototype.topic = function (channel, topic) {
    if(!this._channels[channel]) {
        this.add(channel);
    }

    this._channels[channel][topic] = this._channels[channel][topic] || {};

    return this;
};

/**
 * Returns all channels
 */
ChannelManager.prototype.getChannels = function () {
    return this._channels;
};

module.exports = ChannelManager;
