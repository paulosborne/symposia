var EventEmitter = require('events').EventEmitter;

module.exports = function (symposia) {
    var _       = symposia.util;
    var _stores = {};
    var api     = {};

    var CHANGE_EVENT    = 'change';
    var RESET_EVENT     = 'reset';
    var REMOVE_EVENT    = 'remove';

    function Store (data) {
        this._id = _.uuid();
        this.length = 0;
        this._data = [];

        if (data && _.isType(data, 'array')) {
            this.reset(data);
        }

        return this;
    }

    Store.prototype = _.extend(EventEmitter.prototype, {
        set: function (obj) {
            this._data.push(obj);
            this.emit(CHANGE_EVENT, this);
        },
        /**
         * Replace the current data set
         * @param {array} data
         */
        reset: function (data) {
            this._data = data;
            this.length = data.length;
            this.emit(RESET_EVENT, this);
        },
        /**
         * Iterate over each data item
         * @param {function} callback
         */
        each: function (callback) {
            if (!_.isType(callback, 'function')) {
                throw new TypeError('callback is not a method');
            }
            return this._data.forEach(callback);
        }
    });


    api.create = function (initialData) {
        return new Store(initialData);
    };

    symposia.store = api;
};
