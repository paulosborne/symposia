module.exports = function (symposia, lib, utils) {
    var dom = {};
    var $   = window.jQuery || lib.$;

    dom.find = function (el) {
        return $(el);
    };

    symposia.dom = dom;
};
