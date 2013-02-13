define(["core","./stubs/testmodule"],function ( core, test_module ) {
    describe("core - public interface", function () {

        it("should be able to bootstrap an application", function () {
            expect(typeof core.modules.create).toBe("function");
        });

        it("should throw an exceptiontion", function  () {
            var spy = sinon.spy(core.modules,'create');

            expect(function () {
                core.modules.create('this should throw exception');
            }).toThrow();
        });

        it("should throw an exception if the creator doesn't return an object", function () {

            expect(function () {
                core.modules.create({
                    'notes': {
                        creator: function () {}
                    }
                });
            }).toThrow('creator should return a public interface');

        });


        it("should be able to create & start multiple modules", function () {

            core.modules.create({
                'notes': {
                    creator: test_module
                },
                'history': {
                    creator: test_module
                }
            });

        });
    });
});
