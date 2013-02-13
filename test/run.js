(function () {

    var jasmineStarted;

    require.config({
        baseUrl: '../lib',
        shim: {
            backbone: {
                deps: ['underscore'],
                exports: 'Backbone'
            },
            dom: {
                exports: '$',
                deps: ['jquery']
            }
        },
        paths: {
            backbone: '../vendor/backbone-0.0.9',
            underscore: '../vendor/underscore-1.4.3',
            tests: '../test/specs/',
            mocks: '../test/mocks/',
            jquery: '../vendor/jquery-1.8.3'
        }
    });

    require([
        'tests/app.spec',
        'tests/module.spec'
        ], function () {
        jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
        jasmine.getEnv().execute();
        jasmineStarted = true;
    });
}());
