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

    symposia.modules = {
        create: function ( id, creator, element) {
            var temp;

            if ( typeof creator !== 'function' ) {
                throw new Error("Module creator must be a function");
            }

            // create a temporary instance of the module.
            temp = creator(new Sandbox( symposia, element));

            if ( typeof temp.init !== 'function' && typeof temp.destroy !== 'function' ) {
               throw new Error("Module must include init and destroy methods");
            }

            temp = null;
            moduleData[id] = {
                element: element,
                creator: creator,
                instance: null
            };

            return id;
        },
        create_multiple: function ( modules, callback) {
            var id, temp = {}, result = [];

            if ( typeof modules !== 'object' ) {
                throw new Error('object expected');
            }

            for ( id in modules ) {
                if ( modules.hasOwnProperty(id) ) {
                   result.push(this.create(id, modules[id].creator, modules[id].element));
                }
            }

            if ( typeof callback === 'function' ) {
                callback(result);
            }
        },
        start: function ( modules ) {
            console.log(modules);
        },
        startAll: function () {
            console.log(moduleData);
        },
        stop: function () {
        },
        stopAll: function () {
        },
        list: function () {},
        find: function () {}
    };

    symposia.events = {
        register: function () {
        },
        trigger: function () {
        },
        clear: function () {
        }
    };

    return symposia;
});
