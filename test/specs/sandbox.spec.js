define(function ( require ) {
    // dependencies.
    var core = require ("core");
    var Sandbox = require("sandbox");

    describe("sandbox", function () {
        beforeEach(function () {
        });

        it("should throw an error if no core is passed", function () {
            expect(function () { new Sandbox(); }).toThrow("Core must be an object.");
        });

        it("should be able to access mvc module through core.", function () {
            var instance = new Sandbox( core );
            expect(instance.mvc).toBeDefined();
            expect(typeof instance.mvc.View).toBe('function');
            expect(typeof instance.mvc.Model).toBe('function');
            expect(typeof instance.mvc.Collection).toBe('function');
            expect(typeof instance.mvc.Router).toBe('function');
        });

        it("should allow defaults to be augmented", function () {
            var options = { name: "posbo" };
            var instance = new Sandbox( core, options );
        });

        it("should allow the module to listen to events", function () {

        });

        it("should allow the module to trigger events", function () {

        });



        afterEach(function () {
        });
    });
});
