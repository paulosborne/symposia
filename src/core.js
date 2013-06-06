define(['src/base'], function( base ) {

    var core = {
        _modules   : {},
        _sandboxes : {}
    };

    if ( !base.hasOwnProperty('bus') ) {
        throw new Error('Base object must contain a message bus');
    }

    _.extend( core, base );

    return core;

});
