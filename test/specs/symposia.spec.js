buster.testCase('symposia', function ( run ) {
    require(['symposia'], function ( symposia ) {
        run({
            'pass the obvious test': function () {
                assert(true);
            }
        });
    });
});
