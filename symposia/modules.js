define(['symposia/core','symposia/sandbox'], function( symposia, sandbox ) {

    var moduleData = {};

    symposia.modules = {
        /**
         * Get a module using its moduleId
         *
         * @param { string } moduleId
         * @return { object }
         */
        get: function ( moduleId ) {
            if ( this.isModule( moduleId ) ) {
                return moduleData[moduleId];
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
            var id,
                temp = {},
                options = {
                    init: true
                };

            if ( typeof modules !== 'object' ) {
                throw new Error('module should be an instance of object');
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

                    temp = modules[id].creator( sandbox.create( symposia, id) );
                    if ( typeof temp !== 'object' ) {
                        throw new Error('failed to created temporary module instance');
                    }

                    if ( _.isFunction(temp.init) === false && _.isFunction(temp.destroy) === false) {
                        throw new Error("Module must have both init and destroy methods");
                    }

                    temp = null;

                    moduleData[id] = {
                        id: id,
                        creator: modules[id].creator,
                        instance: null,
                        subscriptions: []
                    };

                    if ( options.init ) {
                        symposia.modules.start( id );
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
         * @param { string } moduleId - the Id of the module to start
         * @return { boolean }
         */
        start: function ( moduleId ) {
            if ( this.isModule( moduleId ) ) {
                if ( _.isObject( moduleData[moduleId].instance )) {
                    return false;
                }

                moduleData[moduleId].instance = moduleData[moduleId].creator( sandbox.create( symposia, moduleId ) );
                moduleData[moduleId].instance.init();

                // announce module initialization
                symposia.bus.publish({
                    channel: 'modules',
                    topic: 'module.started',
                    data: { id: moduleId }
                });

                return _.isObject(moduleData[moduleId].instance);
            }
        },
        /**
         * Stop a module
         *
         * @param { string } moduleId - the id of the module to stop
         * @return { boolean }
         */
        stop: function ( moduleId ) {
            if ( this.isModule( moduleId ) ) {
                if ( _.isNull( moduleData[moduleId].instance ) ) {
                    return false;
                }

                symposia.bus.publish({
                    channel: "modules",
                    topic: "module.stopped",
                    data: { id: moduleId }
                });

                moduleData[moduleId].instance.destroy();
                moduleData[moduleId].instance = null;

                return !_.isObject(moduleData[moduleId].instance);
            }
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            var moduleId;

            for ( moduleId in moduleData ) {
                if ( moduleData.hasOwnProperty( moduleId ) ) {
                    this.stop( moduleId );
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
         * @param {string} moduleId - the module to look for
         * @return {boolean}
         */
        isStarted: function ( moduleId ) {
            if ( this.isModule( moduleId ) ) {
                return _.isObject( moduleData[moduleId].instance );
            }
        },
        /**
         * Does the supplied moduleId resolve to a module
         *
         * @param {string} moduleId - the module to check
         * @return {boolean}
         */
        isModule: function ( moduleId ) {
            if ( _.isUndefined( moduleId ) ) {
                throw new Error('No moduleId supplied');
            }

            if ( !_.isString( moduleId ) ) {
                throw new Error('moduleId must be a string, '+ typeof moduleId +' supplied');
            }

            if ( !_.has( moduleData, moduleId ) ) {
                throw new Error('Unable to find module ['+ moduleId +']');
            }

            return true;
        }
    };

    return symposia;
});
