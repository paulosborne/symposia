var Channel = require('./Channel');
var _ = require('underscore');

function Bus (symposia, config) {
    var bus = {};
    var channels = {};
    var regex = {};

    /**
     * Compare a 
     */
    function compare (binding, topic) {
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
    }

    /**
     * Creates a new subscriber using the provided object.
     *
     * @param {object}
     */
    bus.subscribe = function (subscr) {

        if (!subscr || !subscr.topic || !subscr.callback || !subscr.sid) {
            throw new Error('a valid subscription object is required');
        }

        subscr.channel = subscr.channel || config.DEFAULT_CHANNEL;

        if (!channels[subscr.channel]) {
            channels[subscr.channel] = new Channel();
        }

        channels[subscr.channel].addSubscription(subscr);

        return channels;
    };

    /**
     * Publish a message
     */
    bus.publish = function (envelope) {
        
        if (!envelope || !envelope.topic) {
            throw new Error('a valid envelope is require');
        }

        envelope.channel = envelope.channel || config.DEFAULT_CHANNEL;

        if (!channels[envelope.channel]) {
            return;
        }

        _.each(channels[envelope.channel], function (subscribers, topic) {
            if (compare(topic, envelope.topic)) {
                _.each(subscribers, function (callbacks) {
                    _.each(callbacks, function (cb) {
                        cb(envelope.data);
                    });
                });
            }
        });
        
    };

    /**
     * Unsubscribe a subscriber
     */
    bus.unsubscribe = function () {
        
    };

    /**
     * Returns all subscribers for a channel
     *
     * @param {string} channel
     */
    bus.getSubscribersForChannel = function (channel) {
        return channels[channel];
    };

    symposia.bus = bus;

}

module.exports = Bus;
