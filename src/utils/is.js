module.exports = function (expected, target) {

    switch (expected) {
    case 'array':
        return toString.call(target) === '[object Array]';
    case 'object':
        return target === Object(target);
    case 'element':
        return !!(target && target.nodeType === 1);
    case 'function':
        return typeof target === 'function';
    }
};
