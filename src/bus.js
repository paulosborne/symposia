define(['src/core','postal','postaldiags'], function ( symposia, Postal, Wiretap ) {
    symposia.bus = Postal;

    if ( symposia.hasOwnProperty('debug') && symposia.debug === true ) {
        symposia.wiretap = new Wiretap({ name: 'console' });
    }

    return symposia;
});
