var assert      = require('chai').assert;
var sinon       = require('sinon');
var _           = require('underscore');
var dispatcher         = require('../../src/dispatcher');
var extend      = require('./tools/extend')(dispatcher);

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

        before(function () {
            extend(symposia);
        });

        it ('should be disabled by default', function () {
            assert.isFalse(symposia.dispatcher.isEnabled());
        });

        it('should enable message publishing', function () {
            symposia.dispatcher.enable();
            assert.isTrue(symposia.dispatcher.isEnabled());
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
