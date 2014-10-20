var assert      = require('chai').assert;
var sinon       = require('sinon');
var _           = require('underscore');
var util        = require('../../src/util');
var sandbox     = require('../../src/sandbox');
var dispatcher         = require('../../src/dispatcher');
var extend      = require('./tools/extend')(util, sandbox, dispatcher);

describe('dispatcher', function () {

    describe('subscribe()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it('should throw an Error if subscription is invalid', function () {
            assert.throws(function () {
                symposia.dispatcher.subscribe();
            }, 'a valid subscription object is required');
        });

        it('should create a new subscription', function () {
            var subscribers;
            var subscr = {
                channel: 'beep.boop',
                topic: 'my.topic',
                callback: function () {},
                sid: _.uniqueId('subscriber_')
            };

            symposia.dispatcher.subscribe(subscr);

            subscribers = symposia.dispatcher.getSubscribersForChannel(subscr.channel);

            assert.property(subscribers, subscr.topic);
            assert.property(subscribers[subscr.topic], subscr.sid);
        });

        after(function () {
            symposia = null;
        });
    });

    describe('enable()', function () {
        var symposia = {};
        var sandboxA, sandboxB;
        var queue = [];
        var callback;

        before(function () {
            extend(symposia);
            sandboxA = symposia.sandbox.create();
            sandboxB = symposia.sandbox.create();
            queue   = symposia.dispatcher.getQueue();
            callback = sinon.spy();

            sandboxA.publish({ channel: '/', topic: 'message.o', data: {} });
            sandboxA.publish({ channel: '/', topic: 'message.two', data: {} });
            sandboxA.publish({ channel: '/', topic: 'message.three', data: {} });
            sandboxB.subscribe({ channel: '/', topic: 'message.*', callback: callback });
        });

        it ('should be disabled by default', function () {
            assert.isFalse(symposia.dispatcher.isEnabled());
        });

        it('should queue messages when disabled', function () {
            assert.lengthOf(queue, 3);
        });

        it('should respect the order in which messages were sent', function () {
            assert.equal(queue[0].topic, 'message.o');
            assert.equal(queue[1].topic, 'message.two');
            assert.equal(queue[2].topic, 'message.three');
        });

        it('should not have been called', function () {
            assert.isFalse(callback.called);
        });

        it('should toggle the value of `enabled`', function () {
            symposia.dispatcher.enable();
            assert.isTrue(symposia.dispatcher.isEnabled());
        });

        it('should have sent queued messages', function () {
            assert.lengthOf(queue, 0);
        });

        it('should have triggered the callback', function () {
            assert.isTrue(callback.called);
            assert.equal(callback.callCount,3);
        });
    });

    describe('publish()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should publish a message', function () {
            var base    = { channel: 'beep', topic: 'boop', sid: _.uniqueId('subscr') };
            var subscr  = _.extend({}, base, { callback: sinon.spy() });
            var message = _.extend({}, base, { data: 'nyan' });

            symposia.dispatcher.subscribe(subscr);
            symposia.dispatcher.enable();
            symposia.dispatcher.publish(message);

            assert.ok(subscr.callback.called);
            assert.equal(subscr.callback.callCount, 1);
        });

        after(function () {
            symposia = null;
        });
    });

    describe('getBySubscriberId', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should return a list of subscriptions for a given subscriber ID', function () {
            var sid  = _.uniqueId('subscr');
            var sub1 = { channel: 'meep', topic: 'moop', sid: sid, callback: sinon.spy() };
            var sub2 = { channel: 'nyan', topic: 'cat', sid: sid, callback: sinon.spy() };
            var sub3 = { channel: 'beep', topic: 'boop', sid: sid, callback: sinon.spy() };

            symposia.dispatcher.subscribe(sub1);
            symposia.dispatcher.subscribe(sub2);
            symposia.dispatcher.subscribe(sub3);

            assert.lengthOf(symposia.dispatcher.getBySubscriberId(sid), 3);
        });
    });

    describe('unsubscribe', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should remove a subscription', function () {
            var sid  = _.uniqueId('subscr');
            var sub1 = { channel: 'meep', topic: 'moop', sid: sid, callback: sinon.spy() };
            var sub2 = { channel: 'nyan', topic: 'cat', sid: sid, callback: sinon.spy() };
            var sub3 = { channel: 'beep', topic: 'boop', sid: sid, callback: sinon.spy() };

            symposia.dispatcher.subscribe(sub1);
            symposia.dispatcher.subscribe(sub2);
            symposia.dispatcher.subscribe(sub3);

            assert.lengthOf(symposia.dispatcher.getBySubscriberId(sid), 3);

            symposia.dispatcher.unsubscribe(sub1);

            assert.lengthOf(symposia.dispatcher.getBySubscriberId(sid), 2);
        });

    });

    describe('unsubscribeAll()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should remove all subscriptions for a given subscriber', function () {
            var sid  = _.uniqueId('subscr');
            var sub1 = { channel: 'meep', topic: 'moop', sid: sid, callback: sinon.spy() };
            var sub2 = { channel: 'nyan', topic: 'cat', sid: sid, callback: sinon.spy() };
            var sub3 = { channel: 'beep', topic: 'boop', sid: sid, callback: sinon.spy() };

            symposia.dispatcher.subscribe(sub1);
            symposia.dispatcher.subscribe(sub2);
            symposia.dispatcher.subscribe(sub3);

            assert.lengthOf(symposia.dispatcher.getBySubscriberId(sid), 3);

            symposia.dispatcher.unsubscribeAll(sid);

            assert.lengthOf(symposia.dispatcher.getBySubscriberId(sid), 0);
        });
    });
});
