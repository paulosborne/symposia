var assert  = require('chai').assert;
var _       = require('underscore');
var util    = require('../../src/util');
var store   = require('../../src/store');
var sandbox = require('../../src/sandbox');
var dispatcher    = require('../../src/dispatcher');
var extend  = require('./tools/extend')(util, dispatcher, sandbox, store);
var sinon   = require('sinon');

describe('store()', function () {
    var symposia = {};

    before(function () {
        extend(symposia);
    });

});
