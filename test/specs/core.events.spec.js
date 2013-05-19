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
                'Subscription definition must have a topic and callback',
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

            it('should be initialized with at lease a topic, callback and signature', function () {
                assert.doesNotThrow(function () {
                    subscription = symposia.events.subscribe({
                        topic: 'menu.click.zoom',
                        callback: function () {},
                    },'module-3');
                }, Error);
            });

            it('should throw an error if subscription is not an object', function () {
            });

            it('should throw an error if signature is not a string', function () {
            });

        });


        afterEach(function() {
            //symposia.events.unsubscribeAll();
        });
    });

});
