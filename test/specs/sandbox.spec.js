define(['symposia'], function (symposia) {

    'use strict';

    suite('Sandbox', function () {

        var sandboxes       = [],
            container       = document.getElementById('container'),
            tagName         = 'div',
            total           = 100,
            topic_string    = 'nyan.cat';

        suite('#create', function () {

            suiteSetup(function () {
                sandboxes.push(symposia.sandbox.create());
            });

            test("should create inboxes with unique id", function () {
                expect(sandboxes[0].getId()).to.match(/sandbox-[0-9]+/g);
            });

            suiteTeardown(function () {
                sandboxes = [];
            });

        });


        suite('#getElement', function () {

            suiteSetup(function () {
                _(total).times(function (i) {
                    var div = document.createElement(tagName),
                        _id = _.uniqueId('module-');

                    div.id = _id;
                    container.appendChild(div);
                    sandboxes.push( symposia.sandbox.create(_id) );
                });
            });

            test('should find matching DOM elements', function () {
                _.each(sandboxes, function (sandbox) {
                    var element = sandbox.getElement();
                    var name    = sandbox.getModuleName();
                    expect(element.prop('id')).to.equal(name);
                });
            });

            suiteTeardown(function () {
                sandboxes = [];
            });
        });

        suite('#getSubscriptions', function () {
            suiteSetup(function () {
                var sandbox     = symposia.sandbox.create();

                sandbox.subscribe({ topic: topic_string, callback: $.noop });

                sandboxes.push(sandbox);
            });

            test('should have a subscription', function () {
                var subs = _.first(sandboxes).getSubscriptions();

                expect(subs[0]).to.have.property('topic');
                expect(subs[0].topic).to.equal(topic_string);
            });

            suiteTeardown(function () {
                sandboxes = [];
            });

        });

        suite('#unsubscribeAll', function () {

            setup(function () {
                var sandbox = symposia.sandbox.create();

                _(total).times(function (i) {
                    sandbox.subscribe({ topic: topic_string + '.' + i, callback: $.noop });
                });

                sandboxes.push(sandbox);
            });

            test("should unsubscribe all subscriptions", function () {
                var subscriptions = sandboxes[0].getSubscriptions(),
                    removed = 0;

                subscriptions.should.have.length(total);
                removed = sandboxes[0].unsubscribeAll();
                expect(removed).to.equal(total);
                subscriptions.should.have.length(0);
            });

            teardown(function () {
                sandboxes = [];
            });
        });

        suite('#unsubscribe', function () {
            setup(function () {
                var sandbox = symposia.sandbox.create();

                _(total).times(function (i) {
                    sandbox.subscribe({ topic: topic_string + '.' + i, callback: $.noop });
                });

                sandboxes.push(sandbox);
            });

            test("should remove a single subscription", function () {
                var subs    = sandboxes[0].getSubscriptions();

                subs.should.have.length(total);
                sandboxes[0].unsubscribe({ topic: subs[11].topic });

            });
        });
    });
});
