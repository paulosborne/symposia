define(function(require) {
    var base = require('base');
    describe('base - mvc', function () {
        it("should contain the mvc public interface", function () {
            expect(base.mvc).toBeDefined();
        });

        it("should be able to create and populate backbone models", function () {
            var Model = base.mvc.Model();
            var testModel = new Model();
            testModel.set({'test': 'yes this is a test' });
            expect(testModel.get('test')).toBe('yes this is a test');
        });

        it("should be able to create backbone views", function () {
            expect(base.mvc.View).toBeDefined();
        });

        it("should be able to create backone collections", function () {
            expect(base.mvc.Collection).toBeDefined();
        });
    });

    describe('modules', function () {
        it("should be able to create new modules", function () {
            expect(base.mod.create).toBeDefined();
        });
        it("should be able to start a module", function () {
            expect(base.mod.start).toBeDefined();
        });
        it("should be able to stop a module", function () {
            expect(base.mod.stop).toBeDefined();
        });
        it("should be able to create a zombie module", function () {
            expect(base.mod.zombie).toBeDefined();
        });
    });

    describe('events', function () {
        it("should be able to listen for events", function () {
            expect(base.events.register).toBeDefined();
        });

        it("should be able to trigger events", function () {
            expect(base.events.trigger).toBeDefined();
        });

        it("should be able to see what events are registered", function () {
            expect(base.events.audit).toBeDefined();
        });

        it("should be able to clear all registered events", function () {
            expect(base.events.clear).toBeDefined();
        });
    });
});
