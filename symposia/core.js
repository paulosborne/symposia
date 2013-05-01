define( function () {

    var symposia = window.symposia || {};

    symposia.debug = true;

    if ( typeof window.symposia === 'undefined' ) {
        window.symposia = symposia;
    }

    return symposia;

});
