define(["core","./stubs/testmodule"],function ( symposia, test_module ) {
    describe("symposia - public interface", function () {

        it("should be able to bootstrap an application", function () {
            expect(typeof symposia.modules.create_multiple).toBe("function");
        });

        it("should throw an exception if symposia.bootstrap isn't passed an object", function () {
            var spy = sinon.spy(symposia.modules,'create_multiple');

            expect(function () {
                symposia.modules.create_multiple('this should throw exception');
            }).toThrow('object expected');
        });

        it("should be able to create multiple modules", function () {
            var spy = sinon.spy(symposia.modules,'create');
            var result;

            symposia.modules.create_multiple({
                'notes': {
                    element: '#notes',
                    creator: test_module
                },
                'history': {
                    element: '#history',
                    creator: test_module
                }
            }, function ( result ) {
                expect(result).toContain('notes');
                expect(result.length).toBe(2);
            });

            expect(spy.called).toBeTruthy();
            expect(spy.withArgs('notes', test_module, '#notes')).toBeTruthy();

        });
    });
});
