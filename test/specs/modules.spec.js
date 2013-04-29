buster.testCase('symposia.modules', function ( run ) {
    require(['symposia'], function ( symposia ) {
        run({
            setUp: function () {
                 this.spies = {};

                 this.spies.austin = function ( sandbox ) {
                    return {
                        init: sinon.spy( function() {
                            sandbox.events.on('ping.austin', function ( value ) {
                                console.log( value );
                            });
                        }),
                        destroy: sinon.spy(function() {
                            return true;
                        })
                    };
                };

                this.spies.james = function ( sandbox ) {
                    return {
                        init: sinon.spy ( function () {
                            sandbox.events.on('ping.james', function ( value ) {
                                console.log( value );
                            });
                        }),
                        destroy: sinon.spy( function () {
                            sandbox.events.off('ping.james');
                        })
                    };
                };
            },
            'can create a module': function () {
                var module = {};

                symposia.modules.create({
                    'module_a': {
                        creator: this.spies.austin
                    },
                    'module_b': {
                        creator: this.spies.james
                    }
                });

                module.found = symposia.modules.search({ id: 'module_a' });
                assert.equals( module.found[0].id, 'module_a');
                assert.equals( symposia.bus.listenerTree.ping.austin._listeners.length, 1 );
                assert.equals( module.found[0].instance.init.callCount, 1);
            },
            tearDown: function () {
                symposia.modules.reset();
            }
        });
    });
});
