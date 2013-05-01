require.config({
    shim: {
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min',
        backbone: 'http://backbonejs.org/backbone-min',
        underscore: 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.1/lodash.min',
        postal: 'https://raw.github.com/postaljs/postal.js/master/lib/postal.min',
        postaldiag: 'https://raw.github.com/postaljs/postal.diagnostics/master/src/postal.diagnostics',
        sinon: 'test/lib/sinon/sinon-1.5.2',
        symposia: '../symposia'
    }
});

require( [ 'jquery' ], function ( $ ) {
    $( function () {
        require( [ 'symposia' ] );
    });
});
