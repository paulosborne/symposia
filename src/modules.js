function symposiaModule (sym, lib, _) {
    var api = {};
    var _modules = {};
    var strings = sym.config.strings;

    /**
     * Create a new module instance
     *
     * @param {string} name
     * @return {object}
     */
    function createInstance (name) {
        var options = _modules[name].options;

        return _modules[name].fn.call(null, sym.sandbox.create(name), options, sym);
    }

    /**
     * Create a module
     *
     * @param {string} name
     * @param {function} fn
     */
    api.create = function (name, fn, options) {
        var module, test, sandbox;

        options = options || {};

        if (!_.is('function', fn)) {
            throw new Error(strings.ERROR_CREATING_MODULE);
        }

        test = fn(sym.sandbox.create(name, options));

        if (!_.is('object', test) || !_.has(test, 'init')) {
            throw new Error(strings.ERROR_INITIALIZING_MODULE);
        }

        _modules[name] = {
            id: _.uniqueId('module_'),
            fn: fn,
            createdAt: new Date(),
            options: options
        };

        return _modules[name];
    };

    /**
     * Start a module
     *
     * @param {string} name - module to start
     */
    api.start = function (name) {
        if (_modules[name] && _modules[name].instance) {
            return;
        }

        _modules[name].instance = createInstance(name);
    };

    api.stop = function (name) {
    };

    /**
     * Destroys a module
     *
     * @param {string} name - module to destroy
     */
    api.destroy = function (name) {
        if (!_.has(_modules, name)) {
            return false;
        }

        if (_.has(_modules[name],'instance')) {
            this.stop(name);
        }

        delete(_modules[name]);
    };

    api.destroyAll = function () {
        for (var name in _modules) {
            if (_.has(_modules, name)) {
                this.destroy(name);
            }
        }
    };

    api.get = function () {
        return _modules;
    };

    sym.modules = api;
}

module.exports = symposiaModule;
