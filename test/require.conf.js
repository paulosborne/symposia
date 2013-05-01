require.config({
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        }
    },
    paths: {
        sinon: 'test/lib/sinon/sinon-1.5.2',
        symposia: '../symposia'
    }
});

require( [ 'jquery' ], function ( $ ) {
    $( function () {
        require( [ 'symposia' ] );
    });
});
