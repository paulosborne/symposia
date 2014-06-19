var ChannelManager = require('../../src/bus/ChannelManager');
var Subscription = require('../../src/bus/Subscription');

var cfg = require('../../src/config');
var _ = require('underscore');
var assert = require('assert');
var sinon = require('sinon');

describe('ChannelManager', function () {

    it('should create the default channel', function () {
        var manager = new ChannelManager();

        assert.ok(manager._channels.hasOwnProperty(cfg.DEFAULT_CHANNEL));
    });

    it('should create channels passed into the constructor', function () {
        var defaults = ['error','log','system'];
        var manager  = new ChannelManager(defaults);

        defaults.forEach(function(val) {
            assert.ok(manager._channels.hasOwnProperty(val));
        });
    });

    describe('addChannel()', function () {
        it('should add a channel', function () {
            var manager = new ChannelManager();
            var channel = _.uniqueId('channel');

            manager.addChannel(channel);

            assert.ok(manager._channels.hasOwnProperty(channel));
        });
    });

    describe('addChannelSubscription()', function () {
        it('should add a subscription to the channel', function () {
            var manager = new ChannelManager();
            var topic = _.uniqueId('topic');
            var id = _.uniqueId('id');
            var channel = _.uniqueId('channel');
            var subscription = new Subscription({
                channel: channel,
                topic: topic,
                subscriberId: id,
                callback: sinon.spy()
            });

            manager.addChannelSubscription(subscription);

            assert.ok(manager._channels[channel].hasOwnProperty, topic);
            assert.ok(manager._channels[channel][topic].hasOwnProperty, id);
            assert.ok(_.isArray(manager._channels[channel][topic][id]));

        });
    });

    describe('getChannels()', function () {
        var numChannels = 10000;
        var channels = _.times(numChannels, function () { return _.uniqueId('channel'); });
        var manager = new ChannelManager(channels);
        var numCreated = _.size(manager.getChannels());

        // +1 for default channel
        assert.equal(channels.length + 1, numCreated);
    });


});
