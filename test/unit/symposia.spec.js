var Symposia    = require('../../index')();
var mocks       = require('./mock/modules');
var assert      = require('chai').assert;

describe('Symposia', function () {
    describe('init()', function () {

        it('should throw an error if no modules specifications are supplied', function () {
            assert.throw(function () {
                Symposia.init();
            }, Error, /No module specifications supplied/);
        });

        it('should accept multiple modules as seperate objects', function () {
            Symposia.init(
                { 'A': mocks.withPublish },
                { 'APPLE': mocks.withSubscribe },
                { 'B': mocks.withSubscribe },
                { 'C': mocks.withPublish }
            );

            var keys = Object.keys(Symposia.list());

            assert.lengthOf(keys, 4);
            assert.equal(keys[0], 'A');
            assert.equal(keys[1], 'APPLE');
            assert.equal(keys[2], 'B');
            assert.equal(keys[3], 'C');

        });

        it ('should accept multiple modules as a single object', function () {
            Symposia.init(
                {
                    'A': mocks.withSubscribe,
                    'B': mocks.withPublish,
                    'C': mocks.withSubscribe,
                    'D': mocks.withPublish
                }
            );

            assert.lengthOf(Object.keys(Symposia.list()), 4);
        });

        it('should allow each module to be created from a main property', function () {
            Symposia.init({
                'A': {
                    'main': mocks.withPublish
                }
            });

            var modules = Symposia.list();
            var keys = Object.keys(modules);

            assert.equal(keys[0], 'A');
        });

        it ('should throw an error if a specification object does not contain a main property', function (){
            assert.throw(function () {
                Symposia.init({ 'todo-app': { 'no-main': {} } });
            }, Error, /no module constructor found/);
        });

        it('should automatically start modules', function () {
            Symposia.init({
                'A': {
                    'main': mocks.withPublish
                }
            });

            var modules = Symposia.list();
            var keys = Object.keys(modules);

            assert.lengthOf(keys,1);
            assert.property(modules[keys[0]],'instance');
        });

        afterEach(function () {
            Symposia.reset();
        });
    });
});
