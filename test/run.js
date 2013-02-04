(function () {

    var jasmineStarted;

    require.config({
        baseUrl: '../lib',
        paths: {
            tests: "../test/specs/",
            mocks: "../test/mocks/"
        }
    });

    require(['tests/core.spec','tests/sandbox.spec'], function () {
        jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
        jasmine.getEnv().execute();
        jasmineStarted = true;
    });
}());
