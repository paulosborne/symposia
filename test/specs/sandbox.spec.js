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

        it("should have module and events on its public interface", function () {
            var instance = new Sandbox( core );
            expect(instance.events).toBeDefined();
            expect(instance.modules).toBeDefined();
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
