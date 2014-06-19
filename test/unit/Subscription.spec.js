var Subscription = require('../../src/bus/Subscription');
var assert = require('assert');
var config = require('../../src/config');
var _ = require('underscore');
var sinon = require('sinon');

describe('Subscription()', function () {

    it('should throw an error if no topic is provided', function () {
        assert.throws(function () {
            var subscription = new Subscription({});
        }, Error);
    });

    it('should throw an error if the callback isnt a function', function () {
        assert.throws(function () {
            var subscription = new Subscription({
                topic: 'topic',
                callback: 'hello',
                subscriberId: '1'
            });
        }, Error);
    });

    it('should return a subscription', function () {
        var topic = _.uniqueId('topic');
        var channel = _.uniqueId('channel');
        var id = _.uniqueId('id');
        var callback = sinon.spy();

        var subscription = new Subscription({
            topic: topic,
            channel: channel,
            subscriberId: id,
            callback: callback
        });

        assert.equal(subscription.topic, topic);
        assert.equal(subscription.channel, channel);
        assert.equal(subscription.subscriberId, id);
        assert.equal(subscription.callback, callback);
        assert.ok(subscription.hasOwnProperty('timestamp'));
    });

});
