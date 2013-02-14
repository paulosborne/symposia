define(["core"], function ( symposia ) {

    // spy - international man of mystery.
    var austin = function ( sandbox ) {
        return {
            init: sinon.spy(function() {
                sandbox.listen({
                    "catchphrase": function () {
                        return 'yeah baby!';
                    }
                });
            }),
            add: sinon.spy(function() {
                sandbox.listen({
                    "groovy": true
                });
            }),
            destroy: sinon.spy()
        };
    };

    describe("stopped modules", function () {
        var module;

        beforeEach(function() {
            symposia.modules.reset();
            symposia.modules.create({
                'test': {
                    creator: austin,
                    options: {
                        init: false
                    }
                }
            });
            module = symposia.modules.get.one('test');
        });

        it("should be able to start a stopped module", function () {
            expect(module.instance).toBe(null);
            symposia.modules.start(module.id);
            expect(module.instance.init.called).toBeTruthy();
        });

        it("should not be able to start a module twice", function () {
            symposia.modules.start(module.id);
            symposia.modules.start(module.id);
            expect(module.instance.init.callCount).toBe(1);
        });
    });

    describe("events", function () {
        var module;

        // spy - international man of mystery.
        var austin = function ( sandbox ) {
            return {
                init: sinon.spy(function() {
                    sandbox.listen({
                        "catchphrase": function () {
                            return 'yeah baby!';
                        }
                    });
                }),
                add: sinon.spy(function() {
                    sandbox.listen({
                        "groovy": true
                    });
                }),
                destroy: sinon.spy()
            };
        };

        beforeEach(function() {
            symposia.modules.reset();
            symposia.modules.create({
                'test_events': {
                    creator: austin
                }
            });
            module = symposia.modules.get.one('test_events');
        });

        it("should have been called", function () {
            expect(module.instance.init.called).toBeTruthy();
        });

        it("should be able to register a new event listener", function () {
            module.instance.add();
            expect(_.keys(module.events).length).toBe(2);
        });

    });
});
