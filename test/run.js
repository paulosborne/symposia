(function () {
    var jasmineStarted;

    require.config({
        baseUrl: '../lib',
        paths: {
            tests: "../test/specs/",
            mocks: "../test/mocks/"
        }
    });

    var deps = ["core"];

    function getSpecs() {
        var i, specs = [];
        for ( i = 0; i < deps.length; i++ ) {
            specs.push("tests/"+ deps[i] +".spec");
        }
        return specs;
    }

    require(deps, function () {
        require(getSpecs(), function () {
            jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
            jasmine.getEnv().execute();
            jasmineStarted = true;
        });
    });
}());
