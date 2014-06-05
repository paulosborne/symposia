var signals     = require('signals');
var modules     = require('./module');
var sandbox     = require('./sandbox');
var postal      = require('postal');

function Symposia (config) {
    var _modules   = {};

    var ModuleDefinition = function (name, fn) {
        this.creator    = fn;
        this.name       = name;

        return this;
    };

    ModuleDefinition.prototype.start = function () {
        this.sandbox    = new SandboxDefinition(config);
        this.instance   = this.creator(this.sandbox);

        if (this.instance.init) {
            this.instance.init();
        }
    };

    ModuleDefinition.prototype.stop = function () {
        this.instance.destroy();
        delete(this.instance);
    };

    var SandboxDefinition = function (name) {
        var _el = document.getElementById(name);
        var _subscriptions = [];

        return {
            el: _el,
            publish: postal.publish,
            subscribe: postal.subscribe,
            socket: config.socket || null
        };
    };

    if (config.modules) {
        for (var mod in config.modules) {
            _modules[mod] = new ModuleDefinition(mod, config.modules[mod]);
        }
    }

    return {
        modules: {
            get: function () {
                return _modules;
            },
            startAll: function () {
                for (var mod in _modules) {
                    _modules[mod].start();
                }
            },
            stopAll: function () {
                for (var mod in _modules) {
                    _modules[mod].stop();
                }
            }
        }
    };
}

if (window) {
    Symposia.prototype.router   = require('crossroads');
    Symposia.prototype.hash     = require('hasher');
}

module.exports = Symposia;
