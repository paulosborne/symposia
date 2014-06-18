var idCounter = 0;

module.exports = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};
