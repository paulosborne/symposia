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
            postal: 'vendor/postaljs/lib/postal.min',
            diagnostics: 'vendor/postaljs.diagnostics/lib/postal.diagnostics'
        },
        deps: ['symposia/need']
    },
    debug: false
};

require.config( symposia.config.require );

define([
    'underscore',
    'jquery',
    'postal'
], function ( _, $ ) {
    if ( typeof window.symposia === 'undefined' ) {
        window.symposia = symposia;
    }
    return symposia;
}, function ( err ) {
    console.log( err );
});

