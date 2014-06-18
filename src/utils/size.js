module.exports = function (obj) {
    return obj.length === +obj.length ? obj.length : Object.keys(obj).length;
};
