define([
    'symposia',
    'symposia/Subscription',
    'test/mocks/modules'
], function ( symposia, Subscription, mods ) {

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
                'Required properties missing from subscription request',
                'Invalid subscription type',
                'Invalid signature type'
            ];

            it('should throw an error if initialized without a signature', function () {
                assert.throws(function() {
                    symposia.events.subscribe({ topic: 'test', callback: function () {} });
                }, Error, errorMsg[0]);
            });

            it('should throw an error if initialized without a topic', function () {
                assert.throws(function() {
                    symposia.events.subscribe({ callback: function () {} },'signature');
                }, Error, errorMsg[0]);
            });

            it('should throw an error if initialized without a callback', function () {
                assert.throws(function() {
                    symposia.events.subscribe({ topic: 'test' },'signature');
                }, Error, errorMsg[0]);
            });

            it('should be initialized with at lease a topic, callback and signature', function () {
                assert.doesNotThrow(function () {
                    subscription = symposia.events.subscribe({
                        topic: 'menu.click.zoom',
                        callback: subCallback
                    },'test');
                }, Error);
            });

            it('should throw an error if subscription is not an object', function () {
                assert.throws(function() {
                     new Subscription( 'anything', 'module-1' );
                }, TypeError, errorMsg[1]);
            });

            it('should throw an error if signature is not a string', function () {
                assert.throws(function () {
                    new Subscription( {}, {} );
                }, TypeError, errorMsg[1] );
            });

        });


        afterEach(function() {
            symposia.events.unsubscribeAll();
        });
    });

});
