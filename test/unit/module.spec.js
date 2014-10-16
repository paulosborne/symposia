var assert = require('chai').assert;
var sinon = require('sinon');
var mocks = require('./mock/modules');
var util = require('../../src/util');
var sandbox = require('../../src/sandbox');
var _modules = require('../../src/modules');
var extend = require('./tools/extend')(util, sandbox, _modules);

describe('modules', function () {

    describe('create()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should throw if no module name is provided', function () {
            assert.throws(function () {
                symposia.modules.create(mocks.withPublish);
            });
        });

        it ('should create an instance', function () {
            var module = symposia.modules.create('module1', mocks.withPublish);

            assert.property(module, 'creator');
            assert.typeOf(module.creator, 'function');
            assert.notProperty(module, 'instance')
        });
    });

    describe('start()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should start a module', function () {
            var module = symposia.modules.create('module1', mocks.withPublish);

            assert.notProperty(module, 'instance');
            symposia.modules.start('module1');
            assert.property(module, 'instance');
            assert.ok(module.instance.init.called);
        });
    });

    describe('stop()', function() {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should stop a module', function () {
            var module = symposia.modules.create('module1', mocks.withPublish);

            symposia.modules.start('module1');
            assert.property(module, 'instance');
            assert.ok(symposia.modules.stop('module1'));
            assert.notProperty(module, 'instance');
        });
    });

    describe('destroy()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should destroy a module', function () {
            var module = symposia.modules.create('module2', mocks.withPublish);

            assert.property(symposia.modules.get(),'module2');
            symposia.modules.destroy('module2');
            assert.notProperty(symposia.modules.get(), 'module2');
        });
    });

    describe('destroyAll()', function () {
        var symposia = {};

        before(function () {
            extend(symposia);
        });

        it ('should destroy all modules', function () {
            var module1 = symposia.modules.create('module2', mocks.withPublish);
            var module2 = symposia.modules.create('module3', mocks.withPublish);
            var module3 = symposia.modules.create('module4', mocks.withPublish);
            var keys;

            symposia.modules.start('module2');
            symposia.modules.start('module3');
            symposia.modules.start('module4');

            keys = Object.keys(symposia.modules.get());

            assert.sameMembers(keys, ['module2','module3','module4']);

            symposia.modules.destroyAll();

            assert.notProperty(symposia.modules.get(), 'module2');
            assert.notProperty(symposia.modules.get(), 'module3');
            assert.notProperty(symposia.modules.get(), 'module4');
        });
    });
});
