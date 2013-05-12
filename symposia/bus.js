define(['symposia/core','postal','diagnostics'], function( symposia, postal, Wiretap ) {

    symposia.bus = postal;

    if ( symposia.config.hasOwnProperty('debug') && symposia.config.debug === true ) {
        symposia.wiretap = new Wiretap({ name: 'console' });
    }

    return symposia;
});
