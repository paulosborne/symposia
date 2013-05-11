
var symposia = window.symposia || {},

    symposia.config = {
        shim: {
            jquery:{
                exports: '$'
            },
            underscore: {
                exports: '_'
            }
        },
        paths: {
            postal: 'vendor/postal/lib/postal',
            jquery: 'vendor/jquery/jquery',
            underscore: 'vendor/lodash',
            diagnostics: 'vendor/postal.diagnostics/lib/postal.diagnostics'
        }
    };

require.config( symposia.config );

require(['underscore','jquery','postal','diagnostics'], ( _, $, Postal, Diagnostics ) {
    define(function () {

        var symposia = window.symposia || {};

        symposia.debug = true;

        if ( typeof window.symposia === 'undefined' ) {
            window.symposia = symposia;
        }
        return symposia;
    });
});
