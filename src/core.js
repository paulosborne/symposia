define(['src/base'], function( base ) {

    var core = {
        _modules       : {},
        _sandboxes     : {},
        _subscriptions : []
    };

    if ( !_.has(base,'bus')) {
        throw new Error('Base object must contain a message bus');
    }

    return _.extend( core, base );

});
