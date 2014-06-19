var SubscriberFactory = require('./SubscriberFactory');
var ChannelManager = require('./ChannelManager');
var Envelope = require('./Envelope');

function MessageBus(symposia) {
    var channels = new ChannelManager();
    var subscriberFactory = new SubscriberFactory(channels);
    var api = {};

    /**
     * Creates a new subscription.
     *
     * @param {object}
     */
    api.subscribe = function () {
        var i, len;
        var args = [].slice.call(arguments,0);

        for (i = 0, len = args.length; i < len; i += 1) {
            subscriberFactory.create(args[i]);
        }
    };

    /**
     * Publishes a message to the bus.
     *
     * @param    {object} message
     * @property {string} message.channel   - optional
     * @property {string} message.topic     - required
     * @property {object} message.data      - optional
     * @return   {object}
     */
    api.publish = function (obj) {
        var envelope = new Envelope(obj);

        return {
            sent: envelope
        };
    };

    api.unsubscribe = function () {};

    symposia.bus = api;
}


module.exports = MessageBus;
