module.exports = function (obj, key) {
    return obj !== null && Object.hasOwnProperty.call(obj, key);
};
