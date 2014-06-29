var _ = require('underscore');

function Sandbox (symposia) {
    var sandbox = {};

    // var el = symposia.dom.find('#'+ name);

    sandbox.create = function (name) {
        var _id = _.uniqueId('sandbox_');
        
        return {
            getSubscriptions: function () {
                 return symposia.bus.getBySubscriberId(_id);
            },
            /**
             * Publish a message
             *
             * @param {object} envelope
             */
            publish: function (message) {
                 return symposia.bus.publish(message);
            },
            /**
             * Create a new subscription
             *
             * @param {object} subscription
             */
            subscribe: function (subscription) {
                subscription.sid = _id;

                symposia.bus.subscribe(subscription);
            },
            /**
             * Unsubscribe a subscription
             *
             * @param {topic}
             */
            unsubscribe: function () {},
            find: function ()  {}
        };
    };
    
    symposia.sandbox = sandbox;
}

module.exports = Sandbox;
