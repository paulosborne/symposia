'use strict';

var _ = require('underscore');

function Symposia (options) {
    var symposia = {};

    symposia.extend = function (extension) {
        extension(symposia);
    };

    // symposia.bus
    symposia.extend(require('./bus'));

    // symposia.sandbox
    symposia.extend(require('./sandbox'));

    // symposia.modules
    symposia.extend(require('./modules'));

    if (global.document) {
        //symposia.extend(require('./dom'));
    }

    return {
        /**
         * Create one or more modules
         * @param {object} spec - specification object
         */
        init: function () {
            var args = [].slice.call(arguments, 0);
            var options = {};

            for (var i = 0, len = args.length; i < len; i += 1) {
                for (var id in args[i]) {
                    if(args[i].hasOwnProperty(id)) {
                        switch(({}).toString.call(args[i][id])) {
                        case '[object Function]':
                            symposia.modules.create(id, args[i][id]);
                            break;
                        case '[object Object]':
                            if (!args[i][id].hasOwnProperty('main')) {
                                throw new Error('no module constructor found');
                            }
                            symposia.modules.create(id, args[i][id].main);
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
};

module.exports = Symposia;
