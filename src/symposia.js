var utils   = require('./utils');
var lib     = require('./lib');

function Symposia (config) {
    var symposia = this;

    symposia.config = config;

    // extend
    symposia.extend = function (extension) {
        extension(symposia, lib, utils);
    };

    // symposia.dom
    symposia.extend(require('./dom'));

    // symposia.sandbox
    symposia.extend(require('./sandbox'));

    // symposia.modules
    symposia.extend(require('./module'));

    return symposia;
}

module.exports = Symposia;
