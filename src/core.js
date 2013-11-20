define(['src/base'], function( base ) {

    var core = {
        _modules       : {},
        _sandboxes     : {},
        _subscriptions : []
    };

    core.log = function (type, message) {
        if (!window.console) {
            window.console = {};
        }

        if (!window.console[type]) {
            window.console[type] = function () {};
        }

        window.console[type](message);
    };

    if ( !_.has(base,'bus')) {
        throw new Error('Base object must contain a message bus');
    }

    return _.extend( core, base );

});
