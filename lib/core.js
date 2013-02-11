define(['seed','sandbox'],function( seed, Sandbox ) {
    var moduleData = {},
        core = {};

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
            var i, max, id, temp = {}, result = [];

            if ( typeof modules !== 'object' ) {
                throw new Error('moduleArray should be an instance of object');
            }

            for ( i = 0, max = modules.length; i < max; i += 1 ) {
                if ( typeof  modules[i].creator !== 'function' ) {
                    throw new Error("creator should be an instance of function");
                }

                temp = modules[i].creator(new Sandbox( core, modules[i].element ));

                if ( typeof temp.init !== 'function' && typeof temp.destroy !== 'function' ) {
                    throw new Error("Module must have both init and destroy methods");
                }

                moduleData[modules[i].id] = {
                    element: modules[i].element,
                    creator: modules[i].creator,
                    instance: null
                };

                if ( typeof modules[i].start === 'undefined' ) {
                    core.module.start();
                }

                temp = null;
            }

            if ( typeof callback === 'function' ) {
                return callback(moduleData);
            }
        },
        /**
         * Start one or more modules.
         *
         */
        start: function ( ) {
            var id, i, max;
            if ( arguments.length === 0 ) {
                for ( id in moduleData ) {
                    if( moduleData.hasOwnProperty(id) && moduleData[id].instance === null) {
                        moduleData[id].instance = moduleData[id].creator(new Sandbox(core, moduleData[id].element));
                    }
                }
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
         * Find and return a single module
         *
         * @param {string} id - name of the module to find.
         */
        find: function ( id ) {
            if ( typeof moduleData[id] === 'object' ) {
                return moduleData[id];
            }
            return false;
        }
    };

    core.events = {
        register: function ( evt, id ) {
            if ( moduleData[id] ) {
                moduleData[id].events = evt;
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
        clear: function () {
        }
    };

    return {
        bootstrap: core.module.create
    };
});
