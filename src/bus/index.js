var Channel = require('./Channel');

function Bus (symposia, config) {
    var bus = {};
    var channels = {};

    /**
     * Creates a new subscriber using the provided object.
     *
     * @param {object}
     */
    bus.subscribe = function (subscr) {

        if (!subscr || !subscr.topic || !subscr.callback) {
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

        channels[envelope.channel].publish(envelope);
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
