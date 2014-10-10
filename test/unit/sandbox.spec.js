var assert = require('chai').assert;
var _ = require('underscore');
var sandbox = require('../../src/sandbox');
var extend = require('./tools/extend')(sandbox);

describe('sandbox()', function () {
    describe('create()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it('should expose the correct sandbox methods', function () {
            var sandbox = symposia.sandbox.create(_.uniqueId('module'));

            assert.isFunction(sandbox.publish);
            assert.isFunction(sandbox.subscribe);
            assert.isFunction(sandbox.unsubscribe);
            assert.isFunction(sandbox.unsubscribeAll);
            assert.isFunction(sandbox.getSubscriptions);
            assert.isFunction(sandbox.getElement);
        });
    });
});
