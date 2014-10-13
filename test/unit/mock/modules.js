var sinon = require('sinon');

exports.withPublish = function (sandbox) {
    return {
        init: sinon.spy(),
        destroy: sinon.spy(),
        notify: sinon.spy(function () {
            sandbox.publish({
                topic: 'test.message',
                data: { status: 200 }
            });
        })
    };
};

exports.withSubscribe = function (sandbox) {
    return {
        init: sinon.spy(),
        destroy: sinon.spy(),
        listen: sinon.spy(function() {
            sandbox.subscribe({
                topic: 'test.message',
                callback: sinon.spy()
            });
        })
    };
};

exports.invalid = function (sandbox) {
};
