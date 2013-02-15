define(["core"], function ( symposia ) {

    // spy - an international man of mystery.
    var Austin = function ( sandbox ) {
        return {
            init: sinon.spy(function() {
                sandbox.listen({"all": this.receive });
            }),
            add: sinon.spy(function() {
                sandbox.listen({'austin.stop': this.destroy });
            }),
            send: sinon.spy(function (e) {
                sandbox.notify(e);
            }),
            receive: sinon.spy(),
            destroy: sinon.spy()
        };
    };

    // spy - completes impossible missions
    var Ethan = function ( sandbox ) {
        return {
            init: sinon.spy(function() {
                sandbox.listen({
                    'all': this.receive.bind(this)
                });
            }),
            destroy: sinon.spy(),
            receive: sinon.spy()
        };
    };

    // spy - shaken, not stirred.
    var James = function ( sandbox ) {
        return {
            init: sinon.spy( function () {
                sandbox.listen({
                    "all": this.receive.bind(this),
                    "james.stop": this.destroy
                });
            }),
            destroy: sinon.spy( function () {
            }),
            receive: sinon.spy( function () {
            })
        };
    };

    describe("stopped modules", function () {
        var austin, ethan;

        beforeEach(function() {
            symposia.modules.create({
                'austin': {
                    creator: Austin,
                    options: {
                        // prevent austin from getting his groove on.
                        init: false
                    }
                },
                'ethan': {
                    creator: Ethan
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
                'austin': { creator: Austin },
                'ethan': { creator: Ethan },
                'james': { creator: James }
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
