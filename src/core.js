define(['src/base'], function( base ) {

    var core = {};

    // contains module state.
    core._modules = {};

    // contains sandbox state.
    core._sandboxes = {};

    if ( !base.hasOwnProperty('bus') ) {
        throw new Error('Base object must contain a message bus');
    }

    return _.extend( core, base );

});
