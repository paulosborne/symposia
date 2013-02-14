define(['seed','sandbox'],function( seed, sandbox ) {
    var moduleData = {}, core = {}, eventQueue = [];

    (function () {
        if ( typeof seed.dom !== 'object' ) {
            throw new Error('Seed must have a dom object');
        }
        if ( typeof seed.util !== 'object' ) {
            throw new Error('Seed must have a util object');
        }
        _.extend(core, seed);
    }());

    core.modules = {
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
                if ( _.has(modules,id) ) {

                    _.extend(options, modules[id].options);

                    if ( _.isFunction(modules[id].creator) === false ) {
                        throw new Error("creator should be an instance of function");
                    }

                    temp = modules[id].creator();

                    if ( _.isObject(temp) === false ) {
                        throw new Error('creator should return a public interface');
                    }

                    temp = modules[id].creator( sandbox.create( core, id) );
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
                        events: {}
                    };

                    if ( options.init ) {
                        core.modules.start( id );
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
                moduleData[id].instance = moduleData[id].creator(sandbox.create( core, id ));
                moduleData[id].instance.init();
                return true;
            }
            return false;
        },
        stop: function ( arg ) {
            var id;
            if ( arguments.length === 0 ) {
                for ( id in moduleData ) {
                    if ( _.has(moduleData,id) && _.isNull(moduleData[id].instance) === false ) {
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

    core.events = {
        subscribe: function ( obj, id ) {
            _.extend(moduleData[id].events,obj);
        },
        publish: function ( e ) {
            if (_.has( e,'type') ) {
                throw new Error('emit expects eventObject to have a type property');
            }

            // loop through modules and fire any events that need firing.
            _.each(moduleData, function () {
                if ( _.has(this.events, e.type)) {
                    this.events[e.type](e.data);
                }
            });
        }
    };

    return {
        modules: {
            create: function ( modules, callback ) {
                return core.modules.create( modules, callback, core);
            },
            search: function ( criteria ) {
                return core.modules.search( criteria );
            },
            reset: function () {
                return core.modules.reset();
            },
            start: function ( id ) {
                return core.modules.start( id );
            },
            get: {
                all: function () {
                    return moduleData;
                },
                one: function ( id ) {
                    if ( moduleData[id] ) {
                        return moduleData[id];
                    }
                    return false;
                }
            }
        },
        events: {
            notify: function ( obj ) {
                core.events.publish(obj);
            }
        }
    };
});
