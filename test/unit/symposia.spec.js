var Symposia    = require('../../index');
var mocks       = require('./mock/modules');
var assert      = require('chai').assert;

describe('symposia', function () {

    describe('init()', function () {
        var symposia = new Symposia();

        it('should accept multiple modules as seperate objects', function () {
            symposia.init(
                { 'A': mocks.withPublish },
                { 'APPLE': mocks.withSubscribe },
                { 'B': mocks.withSubscribe },
                { 'C': mocks.withPublish }
            );

            var keys = Object.keys(symposia.list());

            assert.lengthOf(keys, 4);
            assert.equal(keys[0], 'A');
            assert.equal(keys[1], 'APPLE');
            assert.equal(keys[2], 'B');
            assert.equal(keys[3], 'C');

        });

        it ('should accept multiple modules as a single object', function () {
            symposia.init(
                {
                    'A': mocks.withSubscribe,
                    'B': mocks.withPublish,
                    'C': mocks.withSubscribe,
                    'D': mocks.withPublish
                }
            );

            assert.lengthOf(Object.keys(symposia.list()), 4);
        });

        it('should allow each module to be created from a main property', function () {
            symposia.init({
                'A': {
                    'main': mocks.withPublish
                }
            });

            var modules = symposia.list();
            var keys = Object.keys(modules);

            assert.equal(keys[0], 'A');
        });

        afterEach(function () {
            symposia.reset();
        });
    });
});
