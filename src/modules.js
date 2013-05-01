define(['src/core','src/sandbox'], function( symposia, sandbox ) {

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
                        instance: null
                    };

                    if ( options.init ) {
                        symposia.modules.start( id );
                    }
                }
            }

            if ( typeof callback === 'function' ) {
                return callback(moduleData);
            }
        },
        start: function ( id ) {
            if ( _.isString(id) === false ){
                throw new Error("start expects id to be an instance of string");
            }

            if ( moduleData[id] && _.isNull(moduleData[id].instance)) {
                moduleData[id].instance = moduleData[id].creator( sandbox.create( symposia, id ) );
                moduleData[id].instance.init();
                return true;
            }
            return false;
        },
        stop: function ( arg ) {
            var id;
            if ( arguments.length === 0 ) {
                for ( id in moduleData ) {
                    if ( moduleData.hasOwnProperty( id ) && _.isNull(moduleData[id].instance) === false ) {
                        moduleData[id].instance.destroy();
                    }
                }
                moduleData[id].instance = null;
            } else if ( _.isString( arg )) {
                if ( _.isObject(moduleData[id]) && _.isNull(moduleData[id].instance) === false ) {
                    moduleData[id].instance.destroy();
                }
                moduleData[id].instance = null;
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
