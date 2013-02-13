define(['seed','sandbox'],function( seed, sandbox ) {
    var moduleData = {},
        core = {},
        eventQueue = [];

    (function () {
        if ( typeof seed.dom !== 'object' ) {
            throw new Error('Seed must have a dom object');
        }
        if ( typeof seed.util !== 'object' ) {
            throw new Error('Seed must have a util object');
        }
        _.extend(core, seed);
    }());

    core.module = {
        /**
         * Create one or more modules.
         *
         * @param {object} obj - object containing modules to create
         * @param {function} callback - function to call after modules are created.
         */
        create: function ( modules, callback ) {
            var id,
                temp = {},
                options = {
                    init: true
                };

            if ( typeof modules !== 'object' ) {
                throw new Error('moduleArray should be an instance of object');
            }

            for ( id in modules ) {
                if ( modules.hasOwnProperty(id) ) {

                    _.extend(options, modules[id].options);

                    if ( typeof  modules[id].creator !== 'function' ) {
                        throw new Error("creator should be an instance of function");
                    }

                    temp = modules[id].creator();

                    if ( typeof temp !== 'object' ) {
                        throw new Error('creator should return a public interface');
                    }

                    temp = modules[id].creator( sandbox.create( core, id) );
                    if ( typeof temp !== 'object' ) {
                        throw new Error('failed to created temporary module instance');
                    }

                    if ( typeof temp.init !== 'function' && typeof temp.destroy !== 'function' ) {
                        throw new Error("Module must have both init and destroy methods");
                    }

                    temp = null;

                    moduleData[id] = {
                        id: id,
                        creator: modules[id].creator,
                        instance: null
                    };

                    if ( options.init ) {
                        core.module.initialize( options );
                    }
                }
            }

            if ( typeof callback === 'function' ) {
                return callback(moduleData);
            }
        },
        /**
         * Start one or more modules.
         *
         */
        initialize: function ( options ) {
            var id, i, max;
            if ( arguments === 0 ) {
                for ( id in moduleData ) {
                    if( moduleData.hasOwnProperty(id) && moduleData[id].instance === null) {
                        moduleData[id].instance = moduleData[id].creator( sandbox.create(core, id));
                        moduleData[id].instance.init();
                    }
                }
            }
        },
        zombie: function ( id ) {
            if ( moduleData[id] && moduleData[id].instance === null ) {
                return moduleData[id];
            }
        },
        /**
         * Stop a single module
         *
         * @param {string} id - name of the module to stop
         */
        stop: function ( arg ) {
            var id;
            if ( arguments.length === 0 ) {
                for ( id in moduleData ) {
                    if ( moduleData.hasOwnProperty(id) && moduleData[id].instance !== null ) {
                        moduleData[id].instance.destroy();
                    }
                }
                moduleData[id].instance = null;
            } else if ( _.isString( arg )) {
                if ( _.isObject(moduleData[id]) && moduleData[id].instance !== null ) {
                    moduleData[id].instance.destroy();
                }
                moduleData[id].instance = null;
            }
        },
        /**
         * Return the moduleData object
         *
         */
        list: function () {
            return moduleData;
        },
        /*
         * Find modules based on their properties
         *
         * @param {object} criteria - name of the module to find.
         */
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
        register: function ( eventObj, id ) {
            if ( moduleData[id] ) {
                moduleData[id].events = eventObj;
            }
        },
        trigger: function ( evt ) {
            var module, id;
            if ( evt.hasOwnProperty('type') ) {
                for ( id in moduleData ) {
                    if ( moduleData.hasOwnProperty(id) ) {
                        module = moduleData[id];
                        if ( module.events && module.events[evt.type]) {
                            module.events[evt.type](evt.data);
                        }
                    }
                }
            } else {
                throw new Error('Triggered event requires a type property');
            }
        },
        list: function () {
            var id;
            for ( id in moduleData ) {
                if ( moduleData.hasOwnProperty(id) && moduleData[id].events ) {
                    console.log(JSON.stringify(moduleData[id].events));
                }
            }
        }
    };

    return {
        modules: {
            create: function ( modules, callback ) {
                return core.module.create( modules, callback);
            },
            search: function ( criteria ) {
                return core.module.search( criteria );
            },
            reset: function () {
                return core.module.reset();
            }
        }
    };
});
