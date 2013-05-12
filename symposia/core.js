(function() {

    var symposia = window.symposia || {};

    symposia.config = {
        require: {
            shim: {
                jquery: { exports: '$' },
                underscore: { exports: '_' }
            },
            paths: {
                postal: 'vendor/postal/lib/postal',
                jquery: 'vendor/jquery/jquery',
                underscore: 'vendor/lodash/lodash',
                diagnostics: 'vendor/postal.diagnostics/lib/postal.diagnostics'
            }
        },
        debug: true
    };

    console.log( symposia );

    require.config( symposia.config.require );

    define(['underscore','jquery','postal','diagnostics'], function ( _, $, Postal, Diagnostics ) {

        if ( typeof window.symposia === 'undefined' ) {
            window.symposia = symposia;
        }
        return symposia;
    });

})();
