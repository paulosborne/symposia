'use strict';

module.exports = function (symposia) {
    var _       = symposia.util;
    var sandbox = {};

    sandbox.create = function (name) {
        var _id = _.uuid();
        var _stores = [];

        return {
            getSubscriptions: function () {
                 return symposia.dispatcher.getBySubscriberId(_id);
            },
            /**
             * Publish a message
             * @param {object} envelope
             */
            publish: function (message) {
                 return symposia.dispatcher.publish(message);
            },
            /**
             * Create a new subscription
             * @param {object} subscription
             */
            subscribe: function (subscription) {
                symposia.dispatcher.subscribe(_.extend(subscription, {
                    sid: _id
                }));
            },
            /**
             * Unsubscribe a subscription
             * @param {subscription}
             */
            unsubscribe: function (subscription) {
                symposia.dispatcher.unsubscribe(_.extend(subscription, {
                    sid: _id
                }));
            },
            /**
             * Remove all subscriptions
             */
            unsubscribeAll: function () {
                symposia.dispatcher.unsubscribeAll(_id);
            },
            /**
             * Create a new store
             * @param {object}
             * @return {Store}
             */
            createStore: function (data) {
                var store = symposia.store.create(data);
                _stores.push(store._id);
                return store;
            },
            /**
             * Returns all stores created by this sandbox
             * @return {array}
             */
            getStores: function () {
                return _stores.map(function (id) {
                    return symposia.store.getById(id);
                });
            }
        };
    };

    symposia.sandbox = sandbox;
};
