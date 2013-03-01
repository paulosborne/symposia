require.config({
    baseUrl: "/js/vendor/symposia",
    packages: [
        'app/modules/document_toolbar',
        'app/modules/document_viewer'
        ],
    shim: {
        'backbone': {
            exports: 'Backbone',
            deps: ['underscore']
        }
    },
    paths: {
        underscore: 'vendor/underscore-1.4.3',
        backbone: 'vendor/backbone-0.0.9',
        jquery: 'vendor/jquery-1.8.3'
    }
});

require(['app/main']);
