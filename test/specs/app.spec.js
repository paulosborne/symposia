define(["core","./stubs/testmodule"],function ( symposia, test_module ) {
    describe("symposia - public interface", function () {
        it("should be able to bootstrap an application", function () {
            expect(typeof symposia.bootstrap).toBe("function");
        });

        it("should throw an exception if symposia.bootstrap isn't passed an object", function () {
            var spy = sinon.spy(symposia,'bootstrap');

            expect(function () {
                symposia.bootstrap('this should throw exception');
            }).toThrow('object expected');
        });

        it("should be able to create multiple modules", function () {
            var spy = sinon.spy('symposia','bootstrap');

            symposia.bootstrap({
                'notes': {
                    element: '#notes',
                    creator: test_module
                },
                'history': {
                    element: '#history',
                    creator: test_module
                }
            });

        });

        it("should be able to audit modules", function () {
            var modules = symposia.modules.list();
            expect(typeof modules).toBe('object');
        });
    });
});
