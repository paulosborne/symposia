define(['src/core'], function ( core ) {

    var _subscriptions = [];

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

            if ( !_.isString( subscriber) ) {
                throw new Error('Invalid subscriber id');
            }

            if ( !_.isString ( subDef.topic ) || !_.isFunction( subDef.callback ) ) {
                throw new Error('Subscription definition must have a topic (string) and callback (function)');
            }

            subs = _subscriptions[subscriber];

            if ( !subs ) {
                subs = _subscriptions[subscriber] = [];
            }

            subs.push( core.bus.subscribe( subDef ) );

            return subs.length;
        },
        /**
         * Unsubscribe a specific channel/topic from a module
         *
         * @param {object} config
         */
        unsubscribe: function ( config, sig ) {
            if ( _.has(config,'topic') || _.has('channel') ) {
                _.each( _subscriptions, function ( sub ) {
                    if ( sub.signature === sig ) {
                        console.log( sub );
                    }
                });
            } else {
                throw new Error('topic or channel required');
            }
        },
        /**
         * Unsubscribe all subscriptions for a specific subscriber
         *
         * @param {string} id - module to unsubscribe
         * @return {number} - number of subscriptions removed
         */
        unsubscribeAll: function ( subscriber ) {
            var rem = 0, subs = _subscriptions[subscriber];
            if ( subs ) {
                while ( subs.length ) {
                    subs.shift().unsubscribe();
                    rem += 1;
                }
            }
            return rem;
        },
        /**
         * Get current subscribers
         *
         * @param {string} subscriber - ( optional )
         * @return {object}
         */
        getSubscribers: function ( subscriber ) {
            return ( subscriber ) ? _subscriptions[subscriber] : _subscriptions;
        },
        /**
         * Unsubscribe and remove all subscribers from all sandboxes
         *
         */
        reset: function () {
            _.each( _subscriptions, function ( subscription ) {
                while ( subscription.length ) {
                    subscription.shift().unsubscribe();
                }
            });

            // reset subscriptions
            _subscriptions = {};

            return this;
        },
        /**
         * Add a wiretap to listen for events on the message bus
         *
         * @param {function} callback
         */
        addWireTap: function ( callback ) {
            core.bus.addWireTap( callback );
        }
    };

    return core.events;
});
