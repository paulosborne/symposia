define([
    'symposia/base',
    'symposia/sandbox',
    'symposia/Module'
], function( base, sandbox, Module ) {

    var core = {},
        _subscriptions = {},
        moduleData = {};

    _.extend( core, base, sandbox );


    core.modules = {
        /**
         * Get a module using its id
         *
         * @param { string } id
         * @return { object }
         */
        get: function ( id ) {
            if ( this.isModule( id ) ) {
                return moduleData[id];
            }
        },
        getModules: function () {
            return moduleData;
        },
        /**
         * Create a module
         *
         * @param { object } modules
         * @param { function } callback
         * @param { object } context
         */
        create: function ( modules, callback, context ) {
            var name, temp = {},
                options = {
                    init: true
                };

            if ( typeof modules !== 'object' ) {
                throw new Error('Create must be passed an object');
            }

            if ( !_.isUndefined( callback ) && !_.isFunction( callback ) ) {
                throw new Error('Callback must be a function');
            }

            for ( name in modules ) {
                if( modules.hasOwnProperty( name ) ) {

                    _.extend(options, modules[name].options);

                    if ( _.isFunction(modules[name].creator) === false ) {
                        throw new Error("Creator should be an instance of Function");
                    }

                    temp = modules[name].creator();

                    if ( _.isObject(temp) === false ) {
                        throw new Error('Creator should return a public interface');
                    }

                    if ( _.isFunction(temp.init) === false && _.isFunction(temp.destroy) === false) {
                        throw new Error("Module must have both init and destroy methods");
                    }

                    temp = null;

                    moduleData[name] = new Module( core, {
                        name: name,
                        creator: modules[name].creator,
                        options: options
                    });

                    if ( moduleData[name].initialize ) {
                        this.start( name );
                    }
                }
            }

            if ( typeof callback === 'function' ) {
                return callback( moduleData );
            }
        },
        /**
         * Start a module
         *
         * @param { string } id - the Id of the module to start
         * @return { boolean }
         */
        start: function ( name ) {

            if ( this.isModule( name ) ) {
                if ( _.isObject( moduleData[name].instance )) {
                    return false;
                }

                moduleData[name].instance = moduleData[name].creator( core.sandbox.create( core, moduleData[name] ));
                moduleData[name].instance.init();

                // announce module initialization
                core.bus.publish({
                    channel: 'modules',
                    topic: 'module.started',
                    data: { module: moduleData[name] }
                });

                return moduleData[name].instance;
            }
        },
        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function ( name ) {
            if ( this.isModule( name ) ) {
                if ( !_.isObject(moduleData[name].instance ) ) {
                    return false;
                }

                core.bus.publish({
                    channel: "modules",
                    topic: "module.stopped",
                    data: { module: moduleData[name] }
                });

                // remove all subscribtions for this module
                core.events.unsubscribeAll( moduleData[name]._id );

                moduleData[name].instance.destroy();
                moduleData[name].instance = null;

                return delete ( moduleData[name].instance );
            }
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            var name;

            for ( name in moduleData ) {
                if ( moduleData.hasOwnProperty( name ) ) {
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

            _.each( moduleData, function ( module ) {
                if ( _.isObject( module.instance )) {
                    list.push( module );
                }
            });
            return list;
        },
        search: function ( criteria ) {
            return _.where( moduleData, criteria );
        },
        /**
         * Are there modules created?
         *
         * @return {boolean}
         */
        hasModules: function () {
            return ( moduleData.length !== 0 ) ? true : false;
        },
        /**
         * Is the module started?
         *
         * @param {string} id - the module to look for
         * @return {boolean}
         */
        isStarted: function ( name ) {
            if ( this.isModule( name ) ) {
                return _.isObject( moduleData[name].instance );
            }
        },
        /**
         * Does the supplied id resolve to a module
         *
         * @param {string} id - the module to check
         * @return {boolean}
         */
        isModule: function ( id ) {
            if ( _.isUndefined( id ) ) {
                throw new Error('No id supplied');
            }

            if ( !_.isString( id ) ) {
                throw new Error('id must be a string, '+ typeof id +' supplied');
            }

            if ( !_.has( moduleData, id ) ) {
                throw new Error('Unable to find module ['+ id +']');
            }

            return true;
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

            if ( !_.has( subDef, 'topic') || !_.has( subDef, 'callback' ) ) {
                throw new Error('Subscription definition must have a topic and callback');
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
        }
    };

    if ( core.debug ) {
        // provide a global object for console debugging
        window.symposia = core;
    }

    return core;
});
