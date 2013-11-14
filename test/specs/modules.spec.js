define(function (require) {

    var symposia        = require('symposia'),
        mods            = require('test/mocks/modules'),
        _strings        = require('config').strings;

    suite("Modules", function () {
        suite("#create", function () {

            setup(function () {
                symposia.modules.create({
                    'module-1': { creator: mods.a },
                    'module-2': { creator: mods.b }
                });
            });

            test("should create modules", function () {
                expect(symposia._modules).to.have.keys(['module-1','module-2']);
            });

            test('should not start modules automatically', function () {
                expect(symposia.modules.getStopped()).to.have.length(2);
            });

            teardown(function () {
                symposia.modules.reset();
            });

        });

        suite('#startAll', function () {
            setup(function () {
                symposia.modules.create({
                    'module-1': { creator: mods.a },
                    'module-2': { creator: mods.b }
                });
            });

            test('should start a single module', function () {
                //symposia.modules.startOne('module-1');
            });

            teardown(function () {
                symposia.modules.reset();
            });
        });

        suite("#stop", function () {
            setup(function () {
                symposia.modules.create({
                    'module-1': { creator: mods.a }
                }).startAll();
            });

            test('should clear all module instances', function () {
                var mod = symposia.modules.get('module-1');
            });
        });
    });

});
