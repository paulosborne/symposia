var _ = require('underscore');

module.exports = function () {
    var extensions = [].slice.call(arguments);

    return function (symposia) {
        _.each(extensions, function (extension) {
            extension(symposia);
        });
    };
};
