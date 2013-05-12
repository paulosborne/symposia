var symposia = window.symposia || {};

symposia.config = {
    require: {
        shim: {
            jquery: { exports: '$' },
            underscore: { exports: '_' }
        },
        paths: {
            jquery: 'vendor/jquery/jquery',
            underscore: 'vendor/lodash/lodash',
            postal: 'vendor/postaljs/lib/postal',
            diagnostics: 'vendor/postaljs.diagnostics/lib/postal.diagnostics'
        }
    },
    debug: true
};

require.config( symposia.config.require );

define([
    'underscore',
    'jquery',
    'postal',
    'diagnostics'
], function ( _, $ ) {
    if ( typeof window.symposia === 'undefined' ) {
        window.symposia = symposia;
    }
    return symposia;
}, function ( err ) {
    console.log( err );
});

