define(['src/seed','postal','postaldiags'], function ( symposia, Postal, Wiretap ) {

    symposia.messageBus = Postal;

    symposia.wiretap = new Wiretap({ name: 'console' });

    return symposia;
});
