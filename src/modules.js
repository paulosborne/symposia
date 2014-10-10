'use strict';

var _ = require('underscore');

module.exports = function (symposia) {
    var api = {};
    var _modules = {};

    /**
     * Create a new module instance
     * @param {string} name
     * @return {object}
     */
    function createInstance (name) {
        var options = _modules[name].options;
        var sandbox = symposia.sandbox.create(name);

        return _modules[name].creator(sandbox, options, symposia);
    }

    /**
     * Create a module
     * @param {string} name
     * @param {function} fn
     */
    api.create = function (name, fn, options) {
        var module, test, sandbox;

        options = options || {};

        if (!_.isString(name)) {
            throw new Error('Please provide a module name');
        }

        if (!_.isFunction(fn)) {
            throw new Error('Please provide a valid module constructor');
        }

        test = fn(symposia.sandbox.create(name, options));

        if (!_.isObject(test) || !_.has(test, 'init')) {
            throw new Error('Unable to initialize module');
        }

        _modules[name] = {
            id: _.uniqueId('module_'),
            creator: fn,
            options: options
        };

        return _modules[name];
    };

    /**
     * Start a module
     * @param {string} name - module to start
     */
    api.start = function (name) {
        if (_modules[name] && _modules[name].instance) {
            return;
        }

        _modules[name].instance = createInstance(name);
    };

    /**
     * Stop a module, calls the destroy method before deleting the instance
     * @param {string} name - name of the module to stop
     */
    api.stop = function (name) {
        if (_modules.hasOwnProperty(name) && _modules[name].instance) {
            _modules[name].instance.destroy();
            return delete _modules[name].instance;
        }
    };

    /**
     * Destroy a module definition
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

    /**
     * Destroy all module definitions
     */
    api.destroyAll = function () {
        for (var name in _modules) {
            if (_.has(_modules, name)) {
                this.destroy(name);
            }
        }
    };

    /**
     * Returns a single or all module definitions
     * @param {string} name
     * @return {object}
     */
    api.get = function (name) {

        if (arguments.length === 0) {
            return _modules;
        }

        if (!_modules.hasOwnProperty(name)) {
            throw new Error('No module found by that name');
        }

        return _modules[name];
    };

    symposia.modules = api;
};
