define(['src/base','src/core','src/sandbox','src/event','src/module'], function ( base, core ) {

    var symposia = _.extend( base, core , { version: '0.2.6', debug: true });

    if ( symposia.debug ) {
        window.symposia = symposia;
    }

    return symposia;
});
