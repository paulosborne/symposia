var lib         = require('./lib');
var defaults    = require('./config');
var _           = require('underscore');

function Symposia () {
    var args    = [].slice.call(arguments, 0);
    var sym     = this;
    var list    = args[0] || [];
    var i, len, name;

    sym.config = _.extend({}, defaults, args[1]);

    sym.extend = function (extension) {
        extension(sym, lib);
    };

    // symposia.dom
    sym.extend(require('./dom'));

    // symposia.sandbox
    sym.extend(require('./sandbox'));

    // symposia.modules
    sym.extend(require('./modules'));

    // if no arguments were passed in, do nothing.
    if (!list.length) {
        return;
    }

    switch (true) {
    case toString.call(list) === '[object Array]':
        for (i=0, len=list.length; i<len; i+=1) {
            this.modules.create(list[i].moduleId, list[i].fn, list[i].options);
        }
        break;
    case toString.call(list) === '[object Object]':
        for (name in list) {
            if (list.hasOwnProperty(name)) {
                this.modules.create(name, list[name]);
            }
        }
    }

    return sym;
}

module.exports = Symposia;
