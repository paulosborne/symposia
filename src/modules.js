module.exports = function  (sym, util) {
    var _modules = {};
    var api = {};
    
    var ModuleDefinition = function (name, fn) {
        this.fn = fn;
        this.name = name;

        return this;
    };

    ModuleDefinition.prototype.start = function () {
        this.sandbox = sym.sandbox.create();
    };

    api.create = function () {
        return;
    };

    api.start = function() {
        return;
    };

    api.stop = function () {
        return;
    };

    // expose modules API
    sym.modules = api;

};
