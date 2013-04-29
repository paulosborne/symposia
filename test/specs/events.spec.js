buster.testCase("symposia.events", function ( run ) {
    require(['symposia'], function ( symposia ) {
        run({
            "add an event listener": function () {
                symposia.bus.on('foo', function ( value ) { return value; });
                assert.equals(symposia.bus.listeners('foo').length,1);
            },
            'add multiple listeners to a single event': function () {
                symposia.bus.on('foo', function ( value ) { return value; });
                assert.equals(symposia.bus.listeners('foo').length,2);
            }
        });
    });
});
