define(['symposia/base','symposia/sandbox'], function( base, sandbox ) {

    var core = {},
        subscriptions = [],
        moduleData = {};

    _.extend( core, base );

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
        /**
         * Create a module
         *
         * @param { object } modules
         * @param { function } callback
         * @param { object } context
         */
        create: function ( modules, callback, context ) {
            var id, temp = {},
                options = {
                    init: true
                };

            if ( typeof modules !== 'object' ) {
                throw new Error('Create must be passed an object');
            }

            if ( !_.isUndefined( callback ) && !_.isFunction( callback ) ) {
                throw new Error('Callback must be a function');
            }

            for ( id in modules ) {
                if( modules.hasOwnProperty( id ) ) {

                    _.extend(options, modules[id].options);

                    if ( _.isFunction(modules[id].creator) === false ) {
                        throw new Error("Creator should be an instance of Function");
                    }

                    temp = modules[id].creator();

                    if ( _.isObject(temp) === false ) {
                        throw new Error('Creator should return a public interface');
                    }

                    if ( _.isFunction(temp.init) === false && _.isFunction(temp.destroy) === false) {
                        throw new Error("Module must have both init and destroy methods");
                    }

                    temp = null;

                    moduleData[id] = {
                        id: id,
                        creator: modules[id].creator,
                        options: options
                    };

                    if ( moduleData[id].initialize ) {
                        this.start( id );
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
        start: function ( id ) {

            if ( this.isModule( id ) ) {
                if ( _.isObject( moduleData[id].instance )) {
                    return false;
                }

                moduleData[id].instance = moduleData[id].creator( sandbox.create( core, id ));

                // announce module initialization
                core.bus.publish({
                    channel: 'modules',
                    topic: 'module.started',
                    data: { id: id }
                });

                return _.isObject(moduleData[id].instance);
            }
        },
        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function ( id ) {
            if ( this.isModule( id ) ) {
                if ( !_.isObject(moduleData[id].instance ) ) {
                    return false;
                }

                core.bus.publish({
                    channel: "modules",
                    topic: "module.stopped",
                    data: { id: id }
                });

                moduleData[id].instance.destroy();
                moduleData[id].instance = null;

                return delete (moduleData[id].instance);
            }
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            var id;

            for ( id in moduleData ) {
                if ( moduleData.hasOwnProperty( id ) ) {
                    this.stop( id );
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
        isStarted: function ( id ) {
            if ( this.isModule( id ) ) {
                return _.isObject( moduleData[id].instance );
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
        publish: function ( envelope ) {
            core.bus.publish( envelope );
        },
        subscribe: function (subDef, id) {
            var subscription = core.bus.subscribe( subDef );
            // add to subscription
            subscriptions.push({
                id: id,
                sub: subscription
            });
        },
        unsubscribeAll: function ( id ) {
            var subs = _.where( subscriptions, { id: module_id } );
            _.each( subs, function ( sub ) {
                sub.unsubscribe();
            });
        }
    };

    return core;
});
