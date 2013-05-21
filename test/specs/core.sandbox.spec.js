define(['symposia'], function ( symposia ) {
    describe('Core.Sandbox', function () {

        var sandboxes = [];

        before(function () {
            sandboxes.push( symposia.sandbox.create( symposia, 'todo' ));
            sandboxes.push( symposia.sandbox.create( symposia, 'module_a'));
            sandboxes.push( symposia.sandbox.create( symposia, 'module_b'));
        });

        it('should return a new sandbox', function () {
            _.each( sandboxes, function ( sandbox ) {
                assert.isObject( sandbox );
                assert.property( sandbox,'publish');
                assert.property( sandbox,'subscribe');
            });
        });

        it('should assign each sandbox a unique name', function () {
            _.each( sandboxes, function ( sandbox ) {
                assert.match( sandbox.getId(), /^sandbox-[0-9]/);
            });
        });

        it('should attempt to find a DOM element matching the second parameter', function () {
            var $el = sandboxes[0].getElement();
            assert.isString( $el.jquery );
            assert.equal( $el.prop('nodeName'), 'DIV' );
        });

            describe('subscribe()', function () {

                var callback = sinon.spy();

                before(function () {

                    sandboxes[0].subscribe({
                        topic: 'menu.click',
                        callback: callback
                    });

                });

                it('should be able to publish messages', function () {
                    sandboxes[1].publish({ topic: 'menu.click', data: { opt: 'zoom' }});
                    assert.propertyVal( callback.args[0][0],'sender', sandboxes[1].getId() );
                });

                it('should be able to subscribe to published messages', function () {
                    assert.lengthOf(callback.args[0],2);
                    assert.propertyVal( callback.args[0][0],'opt','zoom');
                });

                it('should return the subscriptions made by the sandbox instance', function () {
                    assert.lengthOf( sandboxes[0].getSubscriptions(), 1 );
                });

            });

        after(function () {
            sandbox = null;
        });
    });
});
