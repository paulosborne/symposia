var assert      = require('chai').assert;
var sinon       = require('sinon');
var _           = require('underscore');
var Symposia    = require('../../index');
var config      = require('../../src/config');

describe('Bus', function () {

    it('should extend symposia object', function () {
        var symposia = new Symposia();

        assert.property(symposia, 'bus');
        assert.isFunction(symposia.bus.subscribe);
        assert.isFunction(symposia.bus.publish);
        assert.isFunction(symposia.bus.unsubscribe);
        assert.isFunction(symposia.bus.getSubscribersForChannel);
    });

    describe('subscribe()', function () {
        var symposia = Symposia();

        it('should throw an Error if subscription is invalid', function () {
            assert.throws(function () {
                symposia.bus.subscribe();
            }, 'a valid subscription object is required');
        });

        it('should create a new subscription', function () {
            var subscr = {
                channel: 'beep.boop',
                topic: 'my.topic',
                callback: function () {},
                sid: _.uniqueId('subscriber_')
            };

            symposia.bus.subscribe(subscr);

            subscribers = symposia.bus.getSubscribersForChannel(subscr.channel);

            assert.property(subscribers, subscr.topic);
            assert.property(subscribers[subscr.topic], subscr.sid);
        });

        after(function () {
            symposia = null;
        });
    });

    describe('publish()', function () {
        var symposia = new Symposia();

        it ('should publish a message', function () {
            var base    = { channel: 'beep', topic: 'boop', sid: _.uniqueId('subscr') };
            var subscr  = _.extend({}, base, { callback: sinon.spy() });
            var message = _.extend({}, base, { data: 'nyan' });

            symposia.bus.subscribe(subscr);
            symposia.bus.publish(message);
        });
    });
});
