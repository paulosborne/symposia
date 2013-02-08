(function () {

    var jasmineStarted;

    require.config({
        baseUrl: '../lib',
        shim: {
            backbone: {
                deps: ['underscore'],
                exports: 'Backbone'
            }
        },
        paths: {
            backbone: '../vendor/backbone-0.0.9',
            underscore: '../vendor/underscore-1.4.3',
            tests: '../test/specs/',
            mocks: '../test/mocks/'
        }
    });

    require([
        'tests/app.spec',
        ], function () {
        jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
        jasmine.getEnv().execute();
        jasmineStarted = true;
    });
}());
