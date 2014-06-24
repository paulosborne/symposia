function SymposiaBus(symposia, config) {
    var bus = {};
    var channels = {};

    /**
     * Creates a new subscriber using the provided object.
     *
     * @param {object}
     */
    bus.subscribe = function (obj) {
        if (!obj || !obj.topic) {
            throw new Error('invalid subscription definition');
        }

        if (!obj.channel) {
            obj.channel = config.DEFAULT_CHANNEL;
        }

        if (!channels[obj.channel]) {
            channels[obj.channel] = {};
        }

        channels[obj.channel] = channels[obj.channel] || {};

        return obj;
    };

    /**
     * Publish a message
     */
    bus.publish = function () {
        // publish envelope
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

    // symposia.bus = {};
    // symposia.extend(require('./channels'));
    // symposia.extend(require('./subscription'));
    // symposia.extend(require('./envelope'));

    /**
     * Creates a new subscription.
     *
     * @param {object}
     */
    // api.subscribe = function () {
    //     var i, len;
    //     var args = [].slice.call(arguments,0);

    //     for (i = 0, len = args.length; i < len; i += 1) {
    //         .addSubscription(args[i]);
    //     }
    // };

    /**
     * Publishes a message to the bus.
     *
     * @param    {object} message
     * @property {string} message.channel   - optional
     * @property {string} message.topic     - required
     * @property {object} message.data      - optional
     * @return   {object}
     */
    // api.publish = function (obj) {
    //     var envelope = new Envelope(obj);

    //     return {
    //         sent: envelope
    //     };
    // };

    // api.unsubscribe = function () {};

}

module.exports = SymposiaBus;
