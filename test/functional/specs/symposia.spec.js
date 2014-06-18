/* global Symposia */
var Mock = Symposia.Mocks;

describe('Symposia', function () {
    it('should create modules from an array of object', function () {
        var modules;

        var sym = new Symposia([
            { moduleId: 'example', fn: Mock.withSubscribe },
            { moduleId: 'another_example', fn: Mock.withPublish }
        ]);

        modules = sym.modules.get();
        expect(_.size(modules)).to.equal(2);
    });

    it('should create modules from an object', function () {
        var sym = new Symposia({
            'example': Mock.withSubscribe,
            'another': Mock.withPublish
        });

        expect(_.size(sym.modules.get())).to.equal(2);
    });

    it('should accept optional parameters', function () {
        var sym = new Symposia({}, {
            io: { connected: true }
        });

        sym.config.should.have.property('io');
        sym.config.io.should.have.property('connected');
    });
});
