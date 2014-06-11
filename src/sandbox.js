var resolver = require('./resolver');
var _ = require('underscore');

function Sandbox (sym) {
    var _subscriptions = {};
    var api = {};

    var SandboxDefinition = function (name) {
        var _el = sym.dom.find('#'+ name);
        var _id = _.uniqueId('sandbox_');

        return {
            id: _id,
            el: _el,
            find: function (str) {
                return _el ? sym.dom.find(str, _el) : sym.dom.find(str);
            },
            /**
             * Creates a new event subscription
             *
             * @param {object}  def subscription definition
             */
            subscribe: function (def) {
                var channel = def.channel || 'DEFAULT';
                var topic   = def.topic;

                _subscriptions[channel] = _subscriptions[channel] || {};
                _subscriptions[channel][topic] = _subscriptions[channel][topic] = {};
                _subscriptions[channel][topic][_id] = _subscriptions[channel][topic][_id] = [];
                _subscriptions[channel][topic][_id].push(def.callback);

                return;
            },
            /**
             * Publish an event
             *
             * @param {object} envelope
             */
            publish: function (envelope) {
                var self = this;
                envelope.channel = envelope.channel || "DEFAULT";
                envelope.timeStamp = new Date();

                if (_subscriptions[envelope.channel]) {
                    _.each(_subscriptions[envelope.channel], function (sandboxes, topic) {
                        if(resolver.compare(topic, envelope.topic)) {
                            _.each(sandboxes, function (callbacks, sandbox) {
                                _.each(callbacks, function (cb) {
                                    cb.call(null, envelope.data, envelope);
                                });
                            });
                        }
                    });
                }

                return;
            },
            /**
             * Remove a subscription
             *
             * @param {object} def
             */
            unsubscribe: function (def) {
                var channel, topic, idx;

                channel = def.channel || 'DEFAULT';
                topic   = def.topic;

                if (!_subscriptions[channel] || !_subscriptions[channel][topic]) {
                    return;
                }

                delete(_subscriptions[channel][topic][_id]);

                return;
            },
            /**
             * Remove all subscriptions
             *
             * @return {number}
             */
            unsubscribeAll: function () {
                var subs = this.subscriptions();

                _.each(subs, function (topics, channel) {
                    _.each(topics, function (topic) {
                        this.unsubscribe({ channel: channel, topic: topic});
                    }, this);
                }, this);

                return;
            },
            /**
             * Returns an hash of channel subscriptions
             *
             * @return {object} subs
             */
            subscriptions: function () {
                var subs = {};

                _.each(_subscriptions, function (topics, channel) {
                     _.each(topics, function (sandboxes, topic) {
                         _.each(sandboxes, function (callbacks, sandbox) {
                             if (sandbox === _id) {
                                subs[channel] = subs[channel] = [];
                                subs[channel].push(topic);
                             }
                        });
                     });
                });


                return subs;
            }
        };
    };

    api.create = function (name) {
        return new SandboxDefinition(name);
    };

    api.getSubscriptions = function () {
        return _subscriptions;
    };

    sym.sandbox = api;
}

module.exports = Sandbox;
