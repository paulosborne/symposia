define(['symposia/core','symposia/sandbox'], function( symposia, sandbox ) {

    var moduleData = {};

    symposia.modules = {
        create: function ( modules, callback, context ) {
            var id,
                temp = {},
                options = {
                    init: true
                };

            if ( typeof modules !== 'object' ) {
                throw new Error('moduleArray should be an instance of object');
            }

            for ( id in modules ) {
                if( modules.hasOwnProperty( id ) ) {

                    _.extend(options, modules[id].options);

                    if ( _.isFunction(modules[id].creator) === false ) {
                        throw new Error("creator should be an instance of function");
                    }

                    temp = modules[id].creator();

                    if ( _.isObject(temp) === false ) {
                        throw new Error('creator should return a public interface');
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
        start: function ( id ) {
            if ( !this.isModule( id ) ) {
                throw new Error('Invalid module ID, unable to start');
            } else {
                if ( _.isObject( moduleData[id].instance )) {
                    return false;
                }

                // create new instance.
                moduleData[id].instance = moduleData[id].creator( sandbox.create( symposia, id ) );

                // initialize module.
                moduleData[id].instance.init();

                // announce module initialization
                symposia.bus.publish({
                    channel: 'modules',
                    topic: 'module.started',
                    data: {
                        id: id
                    }
                });
                return true;
            }
        },
        isModule: function ( id ) {
            if ( _.isUndefined( id ) || !_.isString( id ) || !_.has( moduleData, id ) ) {
                return false;
            }
            return true;
        },
        stop: function ( id ) {
            if ( !this.isModule( id ) ) {
                throw new Error('Invalid module ID, unable to stop');
            } else {
                if ( _.isNull( moduleData[id].instance ) ) {
                    return false;
                }

                if ( _.isString(id) && _.isObject( moduleData[id] ) ) {

                    // announce module has stopped.
                    symposia.bus.publish({
                        channel: "modules",
                        topic: "module.stopped",
                        data: { id: id }
                    });

                    // run destroy
                    moduleData[id].instance.destroy();

                    // clear the module instance
                    moduleData[id].instance = null;
                }
            }
        },
        stopAll: function () {
            var id;

            for ( id in moduleData ) {
                if ( moduleData.hasOwnProperty(id) ) {
                    this.stop(id);
                }
            }
        },
        search: function ( criteria ) {
            var result = _.where( moduleData, criteria );
            return result;
        },
        reset: function () {
            moduleData = {};
            return true;
        }
    };

    return symposia;
});
