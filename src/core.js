define(['src/base'], function( base ) {

    var core = {
        _modules       : {},
        _sandboxes     : {},
        _subscriptions : []
    };

    core.log = function (type, message) {
        if (typeof console !== undefined && console[type]) {
            console[type](message);
        }
    };

    if ( !_.has(base,'bus')) {
        throw new Error('Base object must contain a message bus');
    }

    return _.extend( core, base );

});
