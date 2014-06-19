var symposia = {};
var assert = require('chai').assert;

require('../../src/bus/MessageBus')(symposia);

describe('MessageBus()', function () {
    it('should extend the symposia object', function () {
        assert.property(symposia, 'bus');
    });

    it('should expose the public api', function () {
        assert.property(symposia.bus, 'subscribe');
        assert.property(symposia.bus, 'publish');
        assert.property(symposia.bus, 'unsubscribe');
    });

    describe('subscribe', function () {
    
    });

    describe('publish()', function () {
        
    });
});
