var assert      = require('chai').assert;
var _           = require('underscore');
var sandbox     = require('../../src/sandbox');
var store       = require('../../src/store');
var util        = require('../../src/util');
var extend      = require('./tools/extend')(util,store,sandbox);
var mockJSON    = require('./mock/bigdata.json');

describe('sandbox()', function () {
    describe('create()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        describe('sandbox instance', function () {

            it('should expose the correct sandbox methods', function () {
                var sandbox = symposia.sandbox.create(_.uniqueId('module'));

                assert.isFunction(sandbox.publish);
                assert.isFunction(sandbox.subscribe);
                assert.isFunction(sandbox.unsubscribe);
                assert.isFunction(sandbox.unsubscribeAll);
                assert.isFunction(sandbox.getSubscriptions);
            });

            describe("createStore()", function () {
                var sandbox;

                before(function () {
                    sandbox = symposia.sandbox.create();
                });

                it('should create an empty store', function () {
                    var store = sandbox.createStore();

                    assert.equal(store.length, 0);
                });

                it('should accept an optional set of initial data', function () {
                    var customerData = mockJSON;
                    var customers = sandbox.createStore(customerData);
                    assert.equal(customers.length, 5192);
                });
            });
        });
    });
});
