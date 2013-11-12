define(function (require) {

    var core        = require('src/core'),
        _strings    = require('config').strings;

    core.events = {
        /**
         * Publish a message
         *
         * @param {object} envelope - envelope to send
         * @todo message history ?
         * @return {object}
         *
         */
        publish: function ( envelope ) {
            return core.bus.publish( envelope );
        },
        /**
         * subscribe to an event
         *
         * @param {object} subDef - subscriptionDefinition
         * @param {string} id - module name to add subscriber for
         *
         */
        subscribe: function ( subDef, subscriber ) {
            var subs;

            if ( !_.isString(subscriber) ) {
                throw new Error(_strings.SUBSCRIBE_INVALID_ID);
            }

            if ( !_.isString ( subDef.topic ) || !_.isFunction( subDef.callback ) ) {
                throw new Error(_strings.SUBSCRIBE_INVALID_DEF);
            }

            subs = core._subscriptions[subscriber];

            if ( !subs ) {
                subs = core._subscriptions[subscriber] = [];
            }

            subs.push( core.bus.subscribe( subDef ) );

            return subs.length;
        },
        /**
         * Unsubscribe a specific channel/topic from a module
         *
         * @param {object} config
         */
        unsubscribe: function (obj, id) {
            var queue;

            if (obj.topic && core._subscriptions[id]) {

                _(core._subscriptions[id]).where({ topic: obj.topic }).invoke('unsubscribe');


            } else {
                throw new Error(_strings.UNSUBSCRIBE_ERROR);
            }
        },
        /**
         * Unsubscribe all subscriptions for a specific subscriber
         *
         * @param {string} id - module to unsubscribe
         * @return {number} - number of subscriptions removed
         */
        unsubscribeAll: function ( subscriber ) {
            var i = 0,
                subs = core._subscriptions[subscriber];

            if ( subs ) {
                while ( subs.length ) {
                    subs.shift().unsubscribe();
                    i += 1;
                }
            }
            return i;
        },
        /**
         * Get current subscribers
         *
         * @param {string} subscriber - ( optional )
         * @return {object}
         */
        getSubscribers: function ( subscriber ) {
            return ( subscriber ) ? core._subscriptions[subscriber] : core._subscriptions;
        }
    };

    return core.events;
});
