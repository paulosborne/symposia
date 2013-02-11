define(["core","./stubs/testmodule"],function ( core, test_module ) {
    describe("core - public interface", function () {

        it("should be able to bootstrap an application", function () {
            expect(typeof core.bootstrap).toBe("function");
        });

        it("should throw an exceptiontion", function  () {
            var spy = sinon.spy(core,'bootstrap');

            expect(function () {
                core.bootstrap('this should throw exception');
            }).toThrow();
        });

        it("should be able to create & start multiple modules", function () {

            core.bootstrap([
                {
                    id: 'notes',
                    element: '#notes',
                    creator: test_module
                },
                {
                    id: 'history',
                    element: '#history',
                    creator: test_module
                }
            ],
            function ( moduleData ) {
                var id, moduleIds = [];
                for ( id in moduleData ) {
                    if ( moduleData.hasOwnProperty(id) ) {
                        moduleIds.push(id);
                    }
                }
                expect(moduleIds).toContain('notes');
                expect(moduleIds).toContain('history');
                expect(typeof moduleData).toBe('object');
            });

        });
    });
});
