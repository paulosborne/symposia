var lib = require('./lib');
var config = require('./config');
var util = require('./utils');

function Symposia (mods, options) {
    var sym = this;

    sym.config = util.extend({}, config, options);

    sym.extend = function (extension) {
        extension(sym, lib, util);
    };

    // symposia.dom
    sym.extend(require('./dom'));

    // symposia.sandbox
    sym.extend(require('./sandbox'));

    // symposia.modules
    sym.extend(require('./modules'));

    if (!mods) {
        return;
    }

    switch (true) {
    case toString.call(mods) === '[object Array]':
        for (var i=0, len=mods.length; i<len; i+=1) {
            this.modules.create(mods[i].moduleId, mods[i].fn, mods[i].options);
        }
        break;
    case toString.call(mods) === '[object Object]':
        for (var name in mods) {
            if (mods.hasOwnProperty(name)) {
                this.modules.create(name, mods[name]);
            }
        }
    }

    return sym;
}

module.exports = Symposia;
