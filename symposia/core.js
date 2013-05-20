define([
    'symposia/base',
    'symposia/sandbox',
    'symposia/Module'
], function( base, sandbox, Module ) {

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

                temp = mod.creator();

                if ( !_.isObject( temp ) ) {
                    throw new Error("Creator should return a public interface");
                }

                if ( !_.isFunction(temp.init) && !_.isFunction(temp.destroy)) {
                    throw new Error("Module return an object containing both an init and destroy method");
                }

                temp = null;

                _modules[idx] = { name: idx, creator: mod.creator };

            });

            if ( _.isFunction( callback ) ) {
                return callback( _modules );
            }

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
                // turn arguments into a real array
                args = [].splice.call( arguments, 0 );

            if ( args.length ) {
                _.each( args, function ( mod, key ) {
                    if ( !_this.isRunning( mod ) ) {
                        // start & initialize module.
                        _modules[mod].instance = _modules[mod].creator( core.sandbox.create( core, _modules[mod] ));
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
            return this.start.apply( _.keys( _modules ) );
        },

        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function ( name ) {
            if ( this.isModule( name ) ) {
                if ( !_.isObject(_modules[name].instance ) ) {
                    return false;
                }

                core.bus.publish({
                    channel: "modules",
                    topic: "module.stopped",
                    data: { module: _modules[name] }
                });

                // remove all subscribtions for this module
                core.events.unsubscribeAll( _modules[name]._id );

                _modules[name].instance.destroy();
                _modules[name].instance = null;

                return delete ( _modules[name].instance );
            }
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            var name;

            for ( name in _modules ) {
                if ( _modules.hasOwnProperty( name ) ) {
                    this.stop( name );
                }
            }
        },
        /**
         * Returns all started modules
         *
         * @return {array}
         */
        getStarted: function () {
            var list = [];

            _.each( _modules, function ( module ) {
                if ( _.isObject( module.instance )) {
                    list.push( module );
                }
            });
            return list;
        },
        search: function ( criteria ) {
            return _.where( _modules, criteria );
        },
        /**
         * Are there modules created?
         *
         * @return {boolean}
         */
        hasModules: function () {
            return ( _modules.length !== 0 ) ? true : false;
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
        }
    };

    if ( core.debug ) {
        // provide a global object for console debugging
        window.symposia = core;
    }

    return core;
});
