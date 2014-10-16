'use strict';

module.exports = function (symposia) {
    var _ = symposia.util;
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
    api.create = function (name, func, options) {
        var test;

        options = options || {};

        if (typeof name !== 'string') {
            throw new Error('Please provide a module name');
        }

        if (typeof func !== 'function') {
            throw new Error('Please provide a valid module constructor');
        }

        test = func(symposia.sandbox.create(name, options));

        if (typeof test !== 'object' || !test.hasOwnProperty('init')) {
            throw new Error('Unable to initialize module');
        }

        _modules[name] = {
            creator: func,
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
        _modules[name].instance.init();
    };

    api.startAll = function () {
        var key;
        for (key in _modules) {
            if (_.has(_modules, key)) {
                this.start(key);
            }
        }
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
    api.destroy = function (key) {
        if (!_modules.hasOwnProperty(key)) {
            return false;
        }

        if (_modules[key].hasOwnProperty('instance')) {
            this.stop(key);
        }

        delete(_modules[key]);

        return _modules;
    };

    /**
     * Destroy all module definitions
     */
    api.destroyAll = function () {
        var key;
        for (key in _modules) {
            if (_modules.hasOwnProperty(key)) {
                this.destroy(key);
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
