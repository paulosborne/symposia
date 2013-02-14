define(["core"], function ( symposia ) {

    var TEST_MODULE = function ( sandbox ) {
        return {
            init: function () {
                return 200;
            },
            destroy: function () {
                return 300;
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
});
