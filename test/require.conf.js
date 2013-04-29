require.config({
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        }
    },
    paths: {
        backbone: 'lib/backbone/backbone-0.0.9',
        underscore: 'lib/underscore/underscore-1.4.3',
        jquery: 'lib/jquery/jquery-1.8.3'
    }
});
