define(["core"], function ( symposia ) {

    function Spy ( sandbox ) {
        return {
            init: sinon.spy(function () {
                sandbox.listen({ 'all': this.receive.bind(this) });
            }),
            add: sinon.spy(function ( name, callback ) {
                sandbox.listen({ name : this[callback].bind(this) });
            }),
            send: sinon.spy(function (e) {
            }),
            receive: sinon.spy(),
            destroy: sinon.spy()
        };
    }

    describe("stopped modules", function () {
        var austin, ethan;

        beforeEach(function() {
            symposia.modules.create({
                'austin': {
                    creator: new Spy(),
                    options: {
                        // prevent austin from getting his groove on.
                        init: false
                    }
                },
                'ethan': {
                    creator: new Spy()
                }
            });
            austin = symposia.modules.get.one('austin');
            ethan = symposia.modules.get.one('ethan');
        });

        it("should be able to start a stopped module", function () {
            expect(austin.instance).toBe(null);
            symposia.modules.start(austin.id);
            expect(austin.instance.init.called).toBeTruthy();
        });

        it("should not be able to start a module twice", function () {
            symposia.modules.start(austin.id);
            symposia.modules.start(austin.id);
            expect(austin.instance.init.callCount).toBe(1);
        });


        afterEach(function () {
            symposia.modules.reset();
        });
    });

    describe("events", function () {
        var austin, ethan, james;

        beforeEach(function() {
            symposia.modules.create({
                'austin' : { creator: new Spy() },
                'ethan'  : { creator: new Spy() },
                'james'  : { creator: new Spy() }
            });
            austin = symposia.modules.get.one('austin');
            ethan  = symposia.modules.get.one('ethan');
            james  = symposia.modules.get.one('james');
        });

        it("should have been called", function () {
            expect(austin.instance.init.called).toBeTruthy();
        });

        it("should be able to register a new event listener", function () {
            austin.instance.add();
            expect(_.keys(austin.events).length).toBe(2);
        });

        it("should be able to receive event notifications", function () {
            austin.instance.send({ type: 'all', data: { a: 1, b: 2 } });
            expect(ethan.instance.receive.callCount).toBe(1);
            expect(james.instance.receive.callCount).toBe(1);
        });

        afterEach(function() {
            symposia.modules.reset();
        });

    });
});
