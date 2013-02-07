define(function ( require ) {
    var core = require('core');
    describe("core - public interface", function () {
        expect(core.bootstrap).toBeTruthy();
    });
});
