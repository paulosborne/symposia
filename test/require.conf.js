require.config({
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        }
    },
    paths: {
        backbone: 'lib/backbone-0.0.9',
        underscore: 'lib/underscore-1.4.3',
        jquery: 'lib/jquery-1.8.3',
        sinon: 'test/lib/sinon/sinon-1.5.2'
    }
});
