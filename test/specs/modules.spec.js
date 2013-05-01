buster.testCase('symposia.modules', function ( run ) {
    require(['symposia','test/mocks/modules'], function ( symposia, modules ) {
        run({
            'can create a module': function () {

                var instance = {};

                symposia.modules.create({
                    'module_a': {
                        creator: modules.a
                    },
                    'module_b': {
                        creator: modules.b
                    }
                });

                instance.a = symposia.modules.search({ id: 'module_a' });
                assert.equals( instance.a[0].id, 'module_a');
            },
            'can recieve emitted events': function () {
                var instance = {};

                symposia.modules.create({
                    'module_a': {
                        creator: modules.a
                    },
                    'module_b': {
                        creator: modules.b
                    },
                    'module_c': {
                        creator: modules.c
                    }
                });

                instance.a = symposia.modules.search({ id: 'module_a' })[0];
                instance.b = symposia.modules.search({ id: 'module_b' })[0];
                instance.c = symposia.modules.search({ id: 'module_c' })[0];

            },
            tearDown: function () {
                symposia.modules.reset();
            }
        });
    });
});
