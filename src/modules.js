var _ = require('underscore');

function symposiaModule (sym) {
    var api = {};
    var _modules = {};
    var strings = sym.config.strings;

    /**
     * Create a module
     *
     * @param {string} name
     * @param {function} fn
     */
    api.create = function (name, fn, options) {
        var module, test, sandbox;

        options = options || {};

        if (!_.isFunction(fn)) {
            throw new Error(strings.errors.ERROR_CREATING_MODULE);
        }

        test = fn(sym.sandbox.create(name, options));

        if (!_.isObject(test) || !_.has(test, 'init')) {
            throw new Error(strings.errors.ERROR_INITIALIZING_MODULE);
        }

        _modules[name] = {
            id: _.uniqueId('module_'),
            seed: fn,
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
        if(!_.has(_modules, name) || _.has(_modules[name], 'instance')) {
            return false;
        }

        _modules[name].instance = _modules[name].seed(sym.sandbox.create(name), _modules[name].options);
    };

    api.stop = function (name) {
        console.log('stopping', name);
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
        _.each(_modules, function (obj, name) {
            this.destroy(name);
        }, this);
    };

    api.getModules = function () {
        return _modules;
    };

    sym.modules = api;
}

module.exports = symposiaModule;
