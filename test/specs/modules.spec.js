
buster.testCase('symposia.modules', function ( run ) {
    require(['symposia'], function ( symposia ) {
        run({
            setUp: function () {
                 this.spies = {};

                 this.spies.austin = function ( sandbox ) {
                    return {
                        init: sinon.spy( function() {
                            sandbox.events.on('ping.austin', function () {
                                console.log('yeah! baby! yeah!');
                            });
                        }),
                        destroy: sinon.spy(function() {
                            return true;
                        })
                    };
                };
            },
            'can create a module': function () {
                var module = {};

                symposia.modules.create({
                    'module_a': {
                        creator: this.spies.austin
                    }
                });

                module.found = symposia.modules.search({ id: 'module_a' });
                assert.equals( module.found[0].id, 'module_a');
            }
        });
    });
});
