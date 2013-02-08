define(["core","./stubs/testmodule"],function ( symposia, test_module ) {
    describe("symposia - public interface", function () {

        it("should be able to bootstrap an application", function () {
            expect(typeof symposia.bootstrap).toBe("function");
        });

        it("should throw an exceptiontion", function  () {
            var spy = sinon.spy(symposia,'bootstrap');

            expect(function () {
                symposia.bootstrap('this should throw exception');
            }).toThrow('object expected');
        });

        it("should be able to create multiple modules", function () {

            symposia.bootstrap({
                'notes': {
                    element: '#notes',
                    creator: test_module
                },
                'history': {
                    element: '#history',
                    creator: test_module
                }
            }, function ( moduleData ) {
                expect(typeof moduleData).toBe('object');
            });
        });
    });
});
