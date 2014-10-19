'use strict';

var Promise = require('es6-promise').Promise;

function Symposia () {
    var symposia = {};

    if (!(this instanceof Symposia)) {
        return new Symposia();
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
            var i, key, specification;
            var _ = symposia.util;

            if (!args.length) {
                throw new Error('No module specifications supplied');
            }

            for (i = 0; i < args.length; i += 1) {
                for (key in args[i]) {
                    if(_.has(args[i], key)) {
                        specification = args[i][key];
                        switch(true) {
                        case _.isType(specification, 'function'):
                            symposia.modules.create(key, specification);
                            break;
                        case _.isType(specification, 'object'):
                            if (!_.has(specification,'main'))
                                throw new Error('no module constructor found');
                            symposia.modules.create(key, specification.main);
                            break;
                        }
                    }
                }
            }

            Promise.all(symposia.modules.startAll()).then(function () {
                symposia.dispatcher.enable();
            }, function (err) {
            });
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
