var ChannelManager = require('../../src/bus/ChannelManager');
var cfg = require('../../src/config');
var _ = require('underscore');
var assert = require('assert');

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

    describe('add()', function () {
        it('should add a channel', function () {
            var manager = new ChannelManager();
            var channel = _.uniqueId('channel');

            manager.add(channel);

            assert.ok(manager._channels.hasOwnProperty(channel));
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

    describe('_()', function () {
        it('should start chaining', function () {
            var manager = new ChannelManager();

            assert.equal(manager._('channel').value(),'channel');
            assert.equal(manager._('channel').topic('topic').value(), 'topic');

        });
    });


});
