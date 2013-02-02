(function () {
    var jasmineStarted;

    require.config({
        baseUrl: '../'
    });

    var testFiles = [
        "lib/core",
        "test/specs/core.spec"
    ];

    require(testFiles, function () {
        jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
        jasmine.getEnv().execute();
        jasmineStarted = true;
    });
}());
