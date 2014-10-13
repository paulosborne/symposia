'use strict';

var _ = require('underscore');

module.exports = function (symposia) {
    var bus = {};
    var channels = {};
    var regex = {};
    var DEFAULT_CHANNEL = '/';

    /**
     * Compares channel topic against an envelope topic
     * @param {string} binding
     * @param {string} topic
     * @return {boolean}
     */
    bus.compare = function (binding, topic) {
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
     * @return {object} channels
     */
    bus.subscribe = function (obj) {

        if (!obj || !obj.topic || !obj.callback || !obj.sid) {
            throw new Error('a valid subscription object is required');
        }

        obj.channel = obj.channel || DEFAULT_CHANNEL;

        if (!channels[obj.channel]) {
            channels[obj.channel] = {};
        }

        channels[obj.channel][obj.topic] = channels[obj.channel][obj.topic] || {};
        channels[obj.channel][obj.topic][obj.sid] = channels[obj.channel][obj.topic][obj.sid] || [];
        channels[obj.channel][obj.topic][obj.sid].push(obj.callback);

        return channels;
    };

    /**
     * Publish a message
     * @param {object} envelope - message to send
     * @param {string} envelope.channel - the channel to send the message through
     * @param {string} envelope.topic - the message topic
     * @return {context}
     */
    bus.publish = function (envelope) {

        if (!envelope || !envelope.topic) {
            throw new Error('a valid envelope is required');
        }

        envelope.channel = envelope.channel || DEFAULT_CHANNEL;

        if (!channels[envelope.channel]) {
            return;
        }

        _.each(channels[envelope.channel], function (subscribers, topic) {
            if (this.compare(topic, envelope.topic)) {
                _.each(subscribers, function (callbacks) {
                    _.each(callbacks, function (cb) {
                        cb(envelope.data, envelope);
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
    bus.getBySubscriberId = function (subscriber) {
        var subscriptions = [];

        _.each(channels, function (topics, channel) {
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
    bus.unsubscribeAll = function (subscriberId) {
        var subscriptions = this.getBySubscriberId(subscriberId);

        _.each(subscriptions, function (sub) {
            this.unsubscribe(sub);
        }, this);
    };

    /**
     * Unsubscribe a single subscription
     * @param {object} subscription
     */
    bus.unsubscribe = function (sub) {

        if (!sub.channel || !sub.topic || !sub.sid) {
            return;
        }

        if (!channels[sub.channel] || !channels[sub.channel][sub.topic]) {
            return;
        }

        delete channels[sub.channel][sub.topic][sub.sid];
    };

    /**
     * Returns all subscribers for a channel
     * @param {string} channel
     */
    bus.getSubscribersForChannel = function (channel) {
        return channels[channel];
    };

    symposia.bus = bus;

};
