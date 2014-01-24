define(['symposia'], function (symposia) {

    'use strict';

    suite('Sandbox', function () {

        var sandboxes       = [],
            container       = document.getElementById('container'),
            tagName         = 'div',
            total           = 100,
            topic_string    = 'nyan.cat',
            template        = '<div id="<%= id %>"><span><%= id %></span></div>';

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

        suite('$', function () {
            var $el = $(container);

            suiteSetup(function () {
                _(total).times(function (i) {
                    var _id = _.uniqueId('module-');

                    $el.append(_.template(template, { id: _id }));
                    sandboxes.push(symposia.sandbox.create(_id));
                });
            });

            test('should return DOM element that matches sandbox name', function () {
                _.each(sandboxes, function (sb) {
                    var element = sb.$(),
                        name    = sb.getModuleName();

                    expect(element.prop('id')).to.equal(name);
                });
            });

            test('should only find elements within the sandbox DOM element', function () {
                _.each(sandboxes, function (sb) {
                    var spans = sb.$('span');

                    expect(spans.length).to.equal(1);
                    expect(spans.get(0).innerText).to.equal(sb.getModuleName());
                });
            });

            suiteTeardown(function () {
                sandboxes = [];
                $el.empty();
            });
        });

        suite('#getSubscriptions', function () {
            suiteSetup(function () {
                var sandbox     = symposia.sandbox.create();

                sandbox.subscribe({ topic: topic_string, callback: $.noop });
                sandboxes.push(sandbox);
            });

            test('should have a subscription', function () {
                var subs = sandboxes[0].getSubscriptions();

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
                sandboxes[0].unsubscribe(subs[11].topic);

                subs.should.have.length(total - 1);

            });
        });
    });
});
