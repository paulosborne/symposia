define(['symposia'], function ( symposia ) {
    describe('modules', function () {
        beforeEach(function() {
            console.log('before');
        });
        it('should be truthy', function () {
            var a = true;
            assert.equal(a, true);
        });
    });
});
