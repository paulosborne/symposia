define(["core"], function ( symposia ) {

    var TEST_MODULE = function () {
        return {
            init: function () {
                return 200;
            },
            destroy: function () {
                return 300;
            }
        };
    };

    describe("Modules", function () {

        beforeEach(function() {
            symposia.modules.reset();
        });

        it("should be able to find all stopped modules", function () {

            symposia.modules.create({
                'test': {
                    creator: TEST_MODULE,
                    options: {
                        init: false
                    }
                }
            });

            var stopped = symposia.modules.search({ instance: null });
            expect( stopped.length ).toBe(1);
        });
    });
});
