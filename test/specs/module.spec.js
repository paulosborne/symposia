define(["core"], function ( symposia ) {

    var austin = {
        init: sinon.spy(),
        destroy: sinon.spy()
    };

    var james = {};

    var TEST_MODULE = function ( sandbox ) {
        return {
            init: function () {
                sandbox.listen({
                    "test.event" : this.testOne,
                    "another.event" : this.testTwo,
                    "yet.another" : 'hi'
                });

                return 200;
            },
            destroy: function () {
                return 300;
            },
            testOne: function () {
                return 'one';
            },
            testTwo: function() {
                return 'two';
            },
            addRandomListener: function () {
                sandbox.listen({
                    "random.event": function () { return 200; }
                });
            }
        };
    };

    describe("stopped modules", function () {
        var module;

        beforeEach(function() {
            symposia.modules.reset();
            symposia.modules.create({
                'test': {
                    creator: TEST_MODULE,
                    options: {
                        init: false
                    }
                }
            });
            module = symposia.modules.get.one('test');
        });

        it("should be able to start a stopped module", function () {

            // test pre-start state
            expect(module.instance).toBe(null);
            expect(module.id).toBe('test');
            expect(typeof module.creator).toBe('function');

            // start module
            symposia.modules.start(module.id);

            // test post-start state
            expect(module.instance).not.toBe(null);
            expect(module.id).toBe('test');
            expect(typeof module.creator).toBe('function');

            // test init
            expect(typeof module.instance.init).toBe('function');
            expect(module.instance.init()).toBe(200);

            // test destroy
            expect(typeof module.instance.destroy).toBe('function');
            expect(module.instance.destroy()).toBe(300);

        });

        it("should not be able to start a module twice", function () {
            expect(symposia.modules.start(module.id)).toBeTruthy();
            expect(symposia.modules.start(module.id)).toBeFalsy();
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
            expect(module.instance.init.callCount).toBe(1);
        });

        it("should be able to register a new event listener", function () {
            module.instance.add();
            expect(_.keys(module.events).length).toBe(2);
        });

    });
});
