module.exports = function (symposia) {
    var util = {};

    /**
     * Generate a UUID
     * @return {string}
     */
    util.uuid = function uuid () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c==='x' ? r : (r&0x7|0x8)).toString(16);
        });

        return uuid;
    };

    /**
     * Check type of an object
     * @kudos @angustweets
     * @param {object}
     * @param {expected}
     * @return {boolean}
     */
    util.isType = function isType (obj, expected) {
        if (!obj || !expected) return;
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === expected;
    };

    /**
     * Based on underscores _.extend method
     * @kudos @jashkenas
     * @param {object}
     * @return {object}
     */
    util.extend = function extend (obj) {
        var source, prop;

        if (!this.isType(obj, 'object')) return obj;
            for (var i = 1, length = arguments.length; i < length; i++) {
                source = arguments[i];
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        obj[prop] = source[prop];
                    }
                }
            }
        return obj;
    };

    /**
     * Convenience method for hasOwnProperty
     * @param {objecy} object
     * @param {string} prop
     * @return {boolean}
     */
    util.has = function has (object, prop) {
        return object.hasOwnProperty(prop);
    };

    symposia.util = util;
};
