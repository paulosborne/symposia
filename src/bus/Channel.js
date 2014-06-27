function Channel () {
    return this;
}

/**
 * Adds a subscription to this channel
 *
 * @param {object} subscr - object containing subscription properties
 * @return Channel
 */
Channel.prototype.addSubscription = function (subscr) {
    var topic   = subscr.topic;
    var sid     = subscr.sid;
    var cb      = subscr.callback;

    this[topic] = this[topic] || {};
    this[topic][sid] = this[topic][sid] || {};
    this[topic][sid].callbacks = this[topic][sid].callbacks || [];
    this[topic][sid].callbacks.push(cb);

    return this;

};

module.exports = Channel;
