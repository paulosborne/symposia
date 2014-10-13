'use strict';

var _ = require('underscore');

module.exports = function (symposia) {
    var sandbox = {};

    sandbox.create = function (name, options) {
        var _id = _.uniqueId('sandbox_');

        return {
            /**
             * Find the element with a matching ID
             */
            getElement: function () {
                var element;

                if (symposia.dom) {
                    element = symposia.dom.find(name);
                }

                return element;
            },
            getSubscriptions: function () {
                 return symposia.bus.getBySubscriberId(_id);
            },
            /**
             * Publish a message
             * @param {object} envelope
             */
            publish: function (message) {
                 return symposia.bus.publish(message);
            },
            /**
             * Create a new subscription
             * @param {object} subscription
             */
            subscribe: function (subscription) {
                symposia.bus.subscribe(_.extend(subscription, { sid: _id }));
            },
            /**
             * Unsubscribe a subscription
             * @param {subscription}
             */
            unsubscribe: function (subscription) {
                symposia.bus.unsubscribe(_.extend(subscription, { sid: _id }));
            },
            /**
             * Remove all subscriptions
             */
            unsubscribeAll: function () {
                symposia.bus.unsubscribeAll(_id);
            }
        };
    };

    symposia.sandbox = sandbox;
};
