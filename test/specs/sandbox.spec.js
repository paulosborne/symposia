define(function (require) {

    var symposia    = require('symposia');

    suite('Sandbox', function () {

        var sandboxes   = [],
            container   = document.getElementById('container'),
            tagName     = 'div',
            total         = 100;

        suiteSetup(function () {
            _(total).times(function (i) {
                var div = document.createElement(tagName),
                    _id = _.uniqueId('module-');

                div.id = _id;
                container.appendChild(div);
                sandboxes.push( symposia.sandbox.create(_id) );
            });
        });

        suite('#create', function () {
            test("should create sandboxes", function () {
                sandboxes.should.have.length(total);
            });
        });

        suite('#getId', function () {
            test("should return the unique sandbox id", function () {
                _.each(sandboxes, function (sandbox) {
                    expect(sandbox.getId()).to.match(/sandbox-[0-9]+/g);
                });
            });
        });

        suite('#getElement', function () {
            test('should find matching DOM elements', function () {
                _.each(sandboxes, function (sandbox) {
                    var node = sandbox.getElement();

                });
            });
        });

        suite('#getSubscriptions', function () {
            suiteSetup(function () {
                _.each(sandboxes, function (sandbox) {
                    var callbackSpy = sinon.spy();
                    sandbox.subscribe({ topic: 'ping', callback: callbackSpy });
                });
            });
        });

        suiteTeardown(function () {
        });
    });
});
