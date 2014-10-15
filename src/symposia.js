'use strict';

function Symposia (options) {
    var symposia = {};

    if (!(this instanceof Symposia)) {
        return new Symposia(options);
    }

    symposia.extend = function (extension) {
        extension(symposia);
    };

    // symposia.util
    symposia.extend(require('./util'));

    // symposia.dispatcher
    symposia.extend(require('./dispatcher'));

    // symposia.sandbox
    symposia.extend(require('./sandbox'));

    // symposia.modules
    symposia.extend(require('./modules'));

    // symposia.store
    symposia.extend(require('./store'));

    return {
        /**
         * Create one or more modules
         * @param {object} spec - specification object
         */
        init: function () {
            var args = [].slice.call(arguments, 0);
            var _ = symposia.util;
            var i, key;

            for (i = 0; i < args.length; i += 1) {
                for (key in args[i]) {
                    if(args[i].hasOwnProperty(key)) {
                        switch(true) {
                        case _.isType(args[i][key], 'function'):
                            symposia.modules.create(key, args[i][key]);
                            break;
                        case _.isType(args[i][key], 'object'):
                            if (!args[i][key].hasOwnProperty('main')) {
                                throw new Error('no module constructor found');
                            }
                            symposia.modules.create(key, args[i][key].main);
                            break;
                        }
                    }
                }
            }
        },
        /**
         * Returns a list of registered modules
         * @return {object}
         */
        list: function () {
            return symposia.modules.get();
        },
        /**
         * Stops and Destroys all registered modules
         */
        reset: function () {
            symposia.modules.destroyAll();
        }
    };
}

module.exports = Symposia;
