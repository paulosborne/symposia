module.exports = function (sym, lib, utils) {
    var sandbox = {};

    var SandboxDefinition = function (name) {
        var _subscriptions  = [];
        var _el = sym.dom.find('#'+ name);

        return {
            el: function () {
                return _el;
            },
            find: function (str) {
                return _el ? sym.dom.find(str, _el) : sym.dom.find(str);
            },
            subscribe: function () {
                return;
            },
            publish: function () {
                return;
            },
            unsubscribe: function () {
                return;
            },
            unsubscribeAll: function () {
                return;
            }
        };
    };

    sandbox.create = function (name) {
        return new SandboxDefinition(name);
    };

    // expose sandbox API
    sym.sandbox = sandbox;
};
