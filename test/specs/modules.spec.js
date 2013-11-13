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
                }).startAll();
            });

            test("should create modules", function () {
                expect(symposia._modules).to.have.keys(['module-1','module-2']);
            });

            teardown(function () {
                symposia.modules.reset();
            });

        });
    });

});
