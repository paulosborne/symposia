define(['symposia','test/mocks/modules'], function ( symposia, mods ) {
    describe('modules', function () {
        var moduleData = {};

        before(function() {
            moduleData = symposia.modules.create({
                'module_a': {
                    creator: mods.a
                },
                'module_b': {
                    creator: mods.b,
                    options: {
                        init: false
                    }
                }
            }, function ( data ) {
                return data;
            });
        });

        it('should create a module', function () {
            assert.equal(moduleData.hasOwnProperty('module_a'), true);
        });

        it('should initialize module by default', function () {
            assert.equal(_.isObject(moduleData.module_a.instance), true);
        });

        it('should (optionally) prevent modules from being initialized', function () {
            assert.equal(_.isNull(moduleData.module_b.instance), true);
        });

        it('should publish a message when a module starts', function () {

        });
    });
});
