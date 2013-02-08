define(['seed','sandbox'],function( seed, Sandbox ) {
    var moduleData = {}, symposia = {};

    (function () {
        if ( typeof seed.dom !== 'object' ) {
            throw new Error('Seed must have a dom object');
        }
        if ( typeof seed.util !== 'object' ) {
            throw new Error('Seed must have a util object');
        }
        _.extend(symposia, seed);
    }());

    symposia.module = {
        /**
         * Create one or more modules.
         *
         * @param {object} obj - object containing modules to create
         * @param {function} callback - function to call after modules are created.
         */
        create: function ( obj, callback ) {
            var id, temp = {}, result = [];

            if ( typeof obj !== 'object' ) {
                throw new Error('object expected');
            }

            for ( id in obj ) {
                if ( obj.hasOwnProperty(id) ) {
                    if ( typeof obj[id].creator !== 'function' ) {
                        throw new Error("Module creator must be a function");
                    }

                    temp = obj[id].creator(new Sandbox( symposia, obj[id].element));

                    if ( typeof temp.init !== 'function' && typeof temp.destroy !== 'function' ) {
                       throw new Error("Module must include init and destroy methods");
                    }

                    moduleData[id] = {
                        element: obj[id].element,
                        creator: obj[id].creator,
                        instance: null
                    };

                    temp = null;
                }
            }

            if ( typeof callback === 'function' ) {
                return callback(moduleData);
            }
        },
        /*
         * Start a single module
         *
         * @param {string} id - name of the module to start
         */
        start: function ( id ) {
        },
        /**
         * Start all modules
         *
         */
        startAll: function () {
            var id = '';
            for ( id in moduleData ) {
                if( moduleData.hasOwnProperty(id) && moduleData[id].instance === null) {
                    moduleData[id].instance = moduleData[id].creator(new Sandbox(symposia, moduleData[id].element));
                }
            }
        },
        /**
         * Stop a single module
         *
         * @param {string} id - name of the module to stop
         */
        stop: function ( id ) {
            if ( typeof moduleData[id] === 'object' && moduleData[id].instance !== null ) {
                moduleData[id].instance.destroy();
            }
            moduleData[id].instance = null;
        },
        /**
         * Stop all running modules
         *
         */
        stopAll: function () {
            var id;
            for ( id in moduleData ) {
                if ( moduleData.hasOwnProperty(id) && moduleData[id].instance !== null ) {
                    moduleData[id].instance.destroy();
                }
           }
            moduleData[id].instance = null;
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

    symposia.observer = {
        register: function () {
        },
        trigger: function () {
        },
        clear: function () {
        }
    };

    return {
        bootstrap: symposia.module.create
    };
});
