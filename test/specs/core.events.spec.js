define([
    'symposia',
    'test/mocks/modules'
], function ( symposia, mods ) {

    describe('Core.Events', function () {
        describe('publish', function () {
            it('should publish a message', function () {
                var callback = sinon.spy(),
                    wiretap  = symposia.bus.addWireTap(callback),
                    args;

                symposia.events.publish({
                    topic: 'test',
                    data: {
                        message: 'a message to you rudi'
                    }
                });

                args = callback.args[0][1];

                assert.isTrue( callback.calledOnce );
                assert.property( args, 'timeStamp');
                assert.propertyVal( args, 'channel','/');
                assert.propertyVal( args,'topic', 'test' );
                assert.deepPropertyVal( args, 'data.message','a message to you rudi');
            });
        });

        describe('subscribe', function () {
            var errorMsg = [
                'Subscription definition must have a topic (string) and callback (function)',
                'Invalid subscriber id'
            ];

            it('should throw an error if initialized without a subscriber id', function () {
                assert.throws(function() {
                    symposia.events.subscribe({ topic: 'test', callback: function () {} });
                }, Error, errorMsg[1]);
            });

            it('should throw an error if initialized without a topic', function () {
                assert.throws(function() {
                    symposia.events.subscribe({ callback: function () {} },'module-1');
                }, Error, errorMsg[0]);
            });

            it('should throw an error if initialized without a callback', function () {
                assert.throws(function() {
                    symposia.events.subscribe({ topic: 'test' },'module-2');
                }, Error, errorMsg[0]);
            });

            it('should throw an error if callback is not a function', function () {
                assert.throws(function() {
                    symposia.events.subscribe({
                        topic: 'menu.click.1',
                        callback: {}
                    },'module-4');
                }, Error);
            });

            it('should be initialized with at lease a topic, callback and signature', function () {
                assert.doesNotThrow(function () {
                    subscription = symposia.events.subscribe({
                        topic: 'menu.click.zoom',
                        callback: function () {},
                    },'module-3');
                }, Error);
            });

            it('should register multiple subscriptions to the same subscriber', function () {
                symposia.events.subscribe({ topic: 'menu.click.zoom.1', callback: function () {} }, 'module-2' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.2', callback: function () {} }, 'module-2' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-2' );
                assert.lengthOf( symposia.events.getSubscribers('module-2'), 3);
            });

            afterEach(function() {
                symposia.events.reset();
            });
        });

        describe('reset', function () {
            it("should remove and unsubscribe all subscriptions", function () {

                symposia.events.subscribe({ topic: 'menu.click.zoom.1', callback: function () {} }, 'module-1' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.2', callback: function () {} }, 'module-2' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-2' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.1', callback: function () {} }, 'module-3' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.2', callback: function () {} }, 'module-3' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.2', callback: function () {} }, 'module-3' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-4' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-4' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-4' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-4' );

                assert.lengthOf( symposia.events.getSubscribers('module-1'), 1 );
                assert.lengthOf( symposia.events.getSubscribers('module-2'), 2 );
                assert.lengthOf( symposia.events.getSubscribers('module-3'), 3 );
                assert.lengthOf( symposia.events.getSubscribers('module-4'), 4 );
                assert.equal( _.size( symposia.events.reset().getSubscribers()), 0 );
            });

            after(function() {
                symposia.events.reset();
            });
        });

        describe('unsubscribeAll', function () {

            beforeEach(function () {
                symposia.events.subscribe({ topic: 'menu.click.zoom.1', callback: function () {} }, 'module-2' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.2', callback: function () {} }, 'module-2' );
                symposia.events.subscribe({ topic: 'menu.click.zoom.3', callback: function () {} }, 'module-2' );
            });

            it('should unsubscribe all subscriptions for a give subscriber', function () {
                var removed, subs = symposia.events.getSubscribers('module-2');
                assert.lengthOf( subs, 3 );
                assert.equal( symposia.events.unsubscribeAll('module-2'), 3 );
                assert.lengthOf( subs, 0 );
            });

            afterEach(function() {
                symposia.events.reset();
            });
        });

        describe('addWireTap', function () {

        });

    });

});
