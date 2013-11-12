define(['src/base','src/core','src/sandbox','src/module'], function (base, core) {

    var symposia = _.extend(base, core);

    if ( window.debug ) {
        window.symposia = symposia;
    }

    return symposia;
});
