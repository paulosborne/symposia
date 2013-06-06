define(['src/base'], function( base ) {

    var core = {};

    if ( !base.hasOwnProperty('bus') ) {
        throw new Error('Base object must contain a message bus');
    }

    // contains module state.
    core._modules = {};

    // contains sandbox state.
    core._sandboxes = {};

    return _.extend( core, base );

});
