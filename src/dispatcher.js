'use strict';

var _ = require('underscore');
var Promise = require('es6-promise').Promise;

module.exports = function (symposia) {
    var dispatcher = {};
    var bus = {};
    var regex = {};
    var DEFAULT_CHANNEL = '/';

    /**
     * Compares channel topic against an envelope topic
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

        if (!obj || !obj.topic || !obj.callback || !obj.sid) {
            throw new Error('a valid subscription object is required');
        }

        obj.channel = obj.channel || DEFAULT_CHANNEL;

        if (!bus[obj.channel]) {
            bus[obj.channel] = {};
        }

        bus[obj.channel][obj.topic] = bus[obj.channel][obj.topic] || {};
        bus[obj.channel][obj.topic][obj.sid] = bus[obj.channel][obj.topic][obj.sid] || [];
        bus[obj.channel][obj.topic][obj.sid].push(obj.callback);

        return bus;
    };

    /**
     * Publish a message
     * @param {object} envelope - message to send
     * @param {string} envelope.channel - the channel to send the message through
     * @param {string} envelope.topic - the message topic
     * @return {context}
     */
    dispatcher.publish = function (envelope) {
        var promises = [];
        var resolved = [];
        var rejected = [];

        if (!envelope || !envelope.topic) {
            throw new Error('a valid envelope is required');
        }

        envelope.channel = envelope.channel || DEFAULT_CHANNEL;

        if (!bus[envelope.channel]) {
            return;
        }

        _.each(bus[envelope.channel], function (subscribers, topic) {
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
