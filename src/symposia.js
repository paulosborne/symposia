var lib         = require('./lib');
var defaults    = require('./config');
var _           = require('underscore');

function Symposia (config) {
    var sym = this;

    sym.config = _.extend({}, defaults, config);

    // extend
    sym.extend = function (extension) {
        extension(sym, lib);
    };

    // symposia.dom
    sym.extend(require('./dom'));

    // symposia.sandbox
    sym.extend(require('./sandbox'));

    // symposia.modules
    sym.extend(require('./modules'));

    // symposia.remote
    sym.extend(require('./remote'));

    if (config && config.modules) {
        _.each(config.modules, function (fn, name) {
            this.modules.create(name, fn);
        }, this);
    }



    return sym;
}

module.exports = Symposia;
