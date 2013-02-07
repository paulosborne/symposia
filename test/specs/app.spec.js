define(["core","./stubs/testmodule"],function ( symposia, test_module ) {

    describe("symposia - public interface", function () {

        it("should be able to bootstrap an application", function () {
            expect(typeof symposia.bootstrap).toBe("function");
        });

        it("should be able to create a module", function () {
            var spy = sinon.spy(symposia,'bootstrap');

            symposia.bootstrap([
                {
                    element: "#notes",
                    creator: test_module
                }
            ]);

            expect(spy.called).toBeTruthy();
        });

        it("should be able to audit modules", function () {
            console.log(symposia.audit());
            expect(true).toBeTruthy();
        });
    });
});
