define([
    'symposia/base',
    'symposia/sandbox'
], function( base, sandbox ) {

    var _subscriptions = {},
        _modules = {},
        core = _.extend( base, sandbox );

    core.modules = {
        /**
         * Get a module using its id
         *
         * @param { string } id
         * @return { object }
         */
        get: function ( id ) {
            if ( this.isModule( id ) ) {
                return _modules[id];
            }
        },
        getModules: function () {
            return _modules;
        },
        /**
         * Create a module
         *
         * @param { object } modules
         * @param { function } callback
         * @param { object } context
         */
        create: function ( moduleDef, callback, context ) {
            var name, temp, _this = this;

            if ( typeof moduleDef !== 'object' ) {
                throw new Error('Create must be passed an object');
            }

            if ( !_.isUndefined( callback ) && !_.isFunction( callback ) ) {
                throw new Error('Callback must be a function');
            }

            _.each( moduleDef, function ( mod, idx ) {
                if ( !_.isFunction( mod.creator ) ) {
                    throw new Error("Creator should be an instance of Function");
                }

                temp = mod.creator( core.sandbox.create( core, idx ));

                if ( !_.isObject( temp ) ) {
                    throw new Error("Creator should return a public interface");
                }

                if ( !_.isFunction(temp.init) && !_.isFunction(temp.destroy)) {
                    throw new Error("Module return an object containing both an init and destroy method");
                }

                temp = null;

                _modules[idx] = {
                    _id: _.uniqueId('module-'),
                    name: idx,
                    creator: mod.creator
                };

            });

            return this;
        },
        /**
         * Start a module
         *
         * @param { array } arguments - comma seperated list of modules to start
         * @return { boolean }
         */
        start: function () {
            var _this = this,
                args = [].splice.call( arguments, 0 );

            if ( args.length ) {
                _.each( args, function ( mod, key ) {
                    if ( !_this.isRunning( mod ) ) {
                        // start & initialize module.
                        _modules[mod].instance = _modules[mod].creator( core.sandbox.create( core, mod ));
                        _modules[mod].instance.init();
                        // announce
                        core.bus.publish({ channel: 'modules', topic: 'module.started', data: { module: mod } });
                    }
                });
            } else {
                throw new Error("No module name supplied");
            }
            return this;
        },
        /**
         * Start all unstarted modules
         *
         */
        startAll: function () {
            return this.start.apply( this, _.keys( _modules ) );
        },

        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function () {
            var _this = this,
                args = [].splice.call( arguments, 0 );

            if ( !args.length ) {
                throw new Error('No module name supplied');
            }

            _.each( args, function ( mod ) {
                if( _this.isRunning( mod ) ) {
                    // stop module
                    _modules[mod].instance.destroy();
                    _modules[mod].instance = null;
                    // unsubscribe events
                    core.events.unsubscribeAll( mod );
                    // announce module has stopped.
                    core.bus.publish({ channel: 'modules', topic: 'module.stopped', data: { name: mod } });
                    //
                    delete( _modules[mod].instance );
                }
            });

            return this;
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            this.stop.apply( this, _.keys( _modules ));
        },
        /**
         * Returns all started modules
         *
         * @return {array}
         */
        getRunning: function () {
            var running = _.filter( _modules, function ( mod ) {
                return _.has( mod, 'instance' );
            });
            return running;
        },
        /**
         * Is the module started?
         *
         * @param {string} id - the module to look for
         * @return {boolean}
         */
        isRunning: function ( name ) {
            if ( this.isModule( name ) ) {
                return _.isObject( _modules[name].instance );
            }
        },
        /**
         * Does the supplied module name resolve to a module
         *
         * @param {string} name - the module to check
         * @return {boolean}
         */
        isModule: function ( name ) {
            if ( _.isUndefined( name ) ) {
                throw new Error('No module name supplied');
            }

            if ( !_.isString( name ) ) {
                throw new TypeError('Module name must be a string');
            }

            if ( !_.has( _modules, name ) ) {
                throw new Error("Unable to find module '"+ name +"'");
            }

            return true;
        },
        reset: function () {
            _modules = {};
        }
    };

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

    if ( core.debug ) {
        // provide a global object for console debugging
        window.symposia = core;
    }

    return core;
});
