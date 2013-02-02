(function () {
    var jasmineStarted;

    require.config({
        baseUrl: '../lib',
        paths: {
            tests: "../test/specs/",
            mocks: "../test/mocks/"
        }
    });

    var testFiles = [
        "core",
        "tests/core.spec"
    ];

    require(testFiles, function () {
        jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
        jasmine.getEnv().execute();
        jasmineStarted = true;
    });
}());
