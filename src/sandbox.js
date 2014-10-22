'use strict';

module.exports = function (symposia) {
    var _       = symposia.util;
    var sandbox = {};

    sandbox.create = function (name) {
        var _id = _.uuid();
        var _stores = [];

        return {
            getSubscriptions: function getSubscriptions () {
                 return symposia.dispatcher.getBySubscriberId(_id);
            },
            /**
             * Publish a message
             * @param {object} envelope
             */
            publish: function publish (message) {
                 return symposia.dispatcher.publish(message);
            },
            /**
             * Create a new subscription
             * @param {object} subscription
             */
            subscribe: function subscribe (subscription) {
                symposia.dispatcher.subscribe(_.extend(subscription, {
                    sid: _id
                }));
            },
            /**
             * Unsubscribe a subscription
             * @param {subscription}
             */
            unsubscribe: function unsubscribe (subscription) {
                symposia.dispatcher.unsubscribe(_.extend(subscription, {
                    sid: _id
                }));
            },
            /**
             * Remove all subscriptions
             */
            unsubscribeAll: function unsubscribeAll () {
                symposia.dispatcher.unsubscribeAll(_id);
            }
        };
    };

    symposia.sandbox = sandbox;
};
