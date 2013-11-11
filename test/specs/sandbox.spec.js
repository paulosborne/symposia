define(function (require) {

    var symposia    = require('symposia');

    suite('Sandbox', function () {

        var sandboxes   = [],
            container   = document.getElementById('container'),
            tagName     = 'div',
            total         = 100;

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
            var topic_string = 'testing';

            suiteSetup(function () {
                var sandbox     = symposia.sandbox.create();
                    callback    = sinon.spy();

                sandbox.subscribe({
                    topic: topic_string,
                    callback: callback
                });

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
            test("should unsubscribe all subscriptions", function () {
                _.each(sandboxes, function (sandbox) {
                    var subscriptions = sandbox.getSubscriptions();

                    subscriptions.should.have.length(1);
                    sandbox.unsubscribeAll();
                    subscriptions.should.have.length(0);
                });
            });
        });

        suite('#unsubscribe', function () {
            
        });

        suiteTeardown(function () {
            
        });
    });
});
