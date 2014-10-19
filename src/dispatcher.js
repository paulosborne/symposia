'use strict';

var _ = require('underscore');
var Promise = require('es6-promise').Promise;

module.exports = function (symposia) {
    var dispatcher = {};
    var bus = {};
    var regex = {};
    var DEFAULT_CHANNEL = '/';
    var _enabled = false;
    var _queue = [];

    /**
     * Is the queue enabled?
     * return {boolean}
     */
    dispatcher.isEnabled = function () {
        return _enabled;
    };

    /**
     * Returns the message queue
     * @return {array}
     */
    dispatcher.getQueue = function () {
        return _queue;
    };

    /**
     * Allow messages to be delivered and delivers any queued.
     */
    dispatcher.enable = function () {
        if (_enabled) return;
        _enabled = true;
        if (_queue.length) {
            while(_queue.length) {
                _queue.shift(this.publish);
            }
        }
    };

    /**
     * Compares channel topic against an msg topic
     * @param {string} binding
     * @param {string} topic
     * @return {boolean}
     */
    dispatcher.compare = function (binding, topic) {
        var prev, pattern, rgx;

        if (!(rgx = regex[binding])) {
            pattern = "^"+ binding.split('.').map(function (segment) {
                var res = (!!prev) ? "\\.\\b" : "";
                res += (segment === '*') ? "[^.+]" : segment;
                prev = segment;
                return res;
            }).join("") + '$';

            rgx = regex[binding] = new RegExp(pattern);
        }
        return rgx.test(topic);
    };

    /**
     * Creates a new subscriber using the provided object.
     * @param {object} obj - subscription definition
     * @return {object} bus
     */
    dispatcher.subscribe = function (obj) {
        if (!obj || !obj.topic || !obj.callback || !obj.sid)
            throw new Error('a valid subscription object is required');

        obj.channel = obj.channel || DEFAULT_CHANNEL;

        if (!bus[obj.channel])
            bus[obj.channel] = {};

        bus[obj.channel][obj.topic] = bus[obj.channel][obj.topic] || {};
        bus[obj.channel][obj.topic][obj.sid] = bus[obj.channel][obj.topic][obj.sid] || [];
        bus[obj.channel][obj.topic][obj.sid].push(obj.callback);

        return bus;
    };

    /**
     * Publish a message
     * @param {object} msg - message to send
     * @param {string} msg.channel - the channel to send the message through
     * @param {string} msg.topic - the message topic
     * @return {context}
     */
    dispatcher.publish = function (msg) {
        var promises    = [];
        var resolves    = [];
        var rejects     = [];

        if (!msg || !msg.topic)
            throw new Error('a valid msg is required');

        msg.channel = msg.channel || DEFAULT_CHANNEL;

        if (!bus[msg.channel]) return;

        if (!_enabled) {
            return _queue.push(msg);
        }

        _.each(bus[msg.channel], function (subscribers, topic) {
            if (this.compare(topic, msg.topic)) {
                _.each(subscribers, function (callbacks) {

                    promises = callbacks.map(function (cb, i) {
                        return new Promise(function (resolve, reject) {
                            resolves[i] = resolve;
                            rejects[i] = reject;
                        });
                    });

                    callbacks.forEach(function (callback, i) {
                        Promise.resolve(callback(msg.data, msg)).then(function (result) {
                            if (result) {
                                resolves[i](msg.data);
                            } else {
                                rejects[i](new Error('Didnt call'));
                            }
                        });
                    });
                });
            }
        }, this);

        return this;
    };

    /**
     * Return all subscriptions for a given subscriber
     * @param {string} sid - subscriber id
     * @return {object}
     */
    dispatcher.getBySubscriberId = function () {
        var subscriptions = [];

        _.each(bus, function (topics, channel) {
            _.each(topics, function (callbacks, topic) {
                _.each(callbacks, function (cb, sid) {
                    subscriptions.push({
                        channel: channel,
                        topic: topic,
                        callback: cb,
                        sid: sid
                    });
                });
            });
        });

        return subscriptions;
    };

    /**
     * Removes all subscriptions for a given subscriber id
     * @param {string} subscriberId
     */
    dispatcher.unsubscribeAll = function (subscriberId) {
        var subscriptions = this.getBySubscriberId(subscriberId);

        _.each(subscriptions, function (sub) {
            this.unsubscribe(sub);
        }, this);
    };

    /**
     * Unsubscribe a single subscription
     * @param {object} subscription
     */
    dispatcher.unsubscribe = function (sub) {

        if (!sub.channel || !sub.topic || !sub.sid) {
            return;
        }

        if (!bus[sub.channel] || !bus[sub.channel][sub.topic]) {
            return;
        }

        delete bus[sub.channel][sub.topic][sub.sid];
    };


    /**
     * Returns all subscribers for a channel
     * @param {string} channel
     */
    dispatcher.getSubscribersForChannel = function (channel) {
        return bus[channel];
    };

    symposia.dispatcher = dispatcher;

};
