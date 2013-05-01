require.config({
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        }
    },
    paths: {
        backbone: 'lib/backbone-0.0.9',
        // underscore doesn't support AMD, lodash does
        underscore: 'lib/lodash',
        jquery: 'lib/jquery-1.8.3',
        sinon: 'test/lib/sinon/sinon-1.5.2',
        postal: 'lib/postal',
        postaldiags: 'lib/postal.diagnostics'
    }
});

require( [ 'jquery' ], function ( $ ) {
    $( function () {
        require( [ 'symposia' ] );
    } );
} );
