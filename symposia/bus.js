define(['symposia/core','postal','diagnostics'], function( symposia, postal, Wiretap ) {

    symposia.bus = postal;

    if ( symposia.hasOwnProperty('debug') && symposia.debug === true ) {
        symposia.wiretap = new Wiretap({ name: 'console' });
    }

    return symposia;
});
