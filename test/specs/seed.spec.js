define(function(require) {
    var seed = require('seed');

    describe('seed - mvc', function () {

        it("should contain the mvc public interface", function () {
            expect(seed.mvc).toBeDefined();
        });

        it("should be able to create and populate backbone models", function () {
            var Model = seed.mvc.Model();
            var testModel = new Model();
            testModel.set({'test': 'yes this is a test' });
            expect(testModel.get('test')).toBe('yes this is a test');
        });

        it("should be able to create backbone views", function () {
            expect(seed.mvc.View).toBeDefined();
        });

        it("should be able to create backone collections", function () {
            expect(seed.mvc.Collection).toBeDefined();
        });

    });

    describe('modules', function () {
        it("should be able to create new modules", function () {
            expect(seed.mod.create).toBeDefined();
        });
        it("should be able to start a module", function () {
            expect(seed.mod.start).toBeDefined();
        });
        it("should be able to stop a module", function () {
            expect(seed.mod.stop).toBeDefined();
        });
        it("should be able to create a zombie module", function () {
            expect(seed.mod.zombie).toBeDefined();
        });
    });

    describe('events', function () {
        it("should be able to listen for events", function () {
            expect(seed.events.register).toBeDefined();
        });

        it("should be able to trigger events", function () {
            expect(seed.events.trigger).toBeDefined();
        });

        it("should be able to see what events are registered", function () {
            expect(seed.events.audit).toBeDefined();
        });

        it("should be able to clear all registered events", function () {
            expect(seed.events.clear).toBeDefined();
        });
    });

});
