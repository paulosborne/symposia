var assert      = require('chai').assert;
var sinon       = require('sinon');
var _           = require('underscore');
var bus         = require('../../src/bus');
var extend      = require('./tools/extend')(bus);

describe('bus', function () {

    describe('subscribe()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it('should throw an Error if subscription is invalid', function () {
            assert.throws(function () {
                symposia.bus.subscribe();
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
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should publish a message', function () {
            var base    = { channel: 'beep', topic: 'boop', sid: _.uniqueId('subscr') };
            var subscr  = _.extend({}, base, { callback: sinon.spy() });
            var message = _.extend({}, base, { data: 'nyan' });

            symposia.bus.subscribe(subscr);
            symposia.bus.publish(message);

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

            symposia.bus.subscribe(sub1);
            symposia.bus.subscribe(sub2);
            symposia.bus.subscribe(sub3);

            assert.lengthOf(symposia.bus.getBySubscriberId(sid), 3);
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

            symposia.bus.subscribe(sub1);
            symposia.bus.subscribe(sub2);
            symposia.bus.subscribe(sub3);

            assert.lengthOf(symposia.bus.getBySubscriberId(sid), 3);

            symposia.bus.unsubscribe(sub1);

            assert.lengthOf(symposia.bus.getBySubscriberId(sid), 2);
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

            symposia.bus.subscribe(sub1);
            symposia.bus.subscribe(sub2);
            symposia.bus.subscribe(sub3);

            assert.lengthOf(symposia.bus.getBySubscriberId(sid), 3);

            symposia.bus.unsubscribeAll(sid);

            assert.lengthOf(symposia.bus.getBySubscriberId(sid), 0);
        });
    });
});
