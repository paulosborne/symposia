var SymModules = require('../../src/modules');
var assert = require('assert');

describe('Modules', function () {
    it('should be a function', function () {
        assert.ok(typeof SymModules === 'function');
    });
});
