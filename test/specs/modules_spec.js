/* global Symposia */
describe('Modules', function () {
    var mock = Symposia.Mocks;
    var sym  = new Symposia();

    describe('destroyAll()', function () {
        before(function () {
            _.times(100, function () {
                sym.modules.create(_.uniqueId('module'), mock.withSubscribe);
            });
        });

        it('should destroy all modules', function () {
            expect(_.size(sym.modules.get())).to.equal(100);
            sym.modules.destroyAll();
            expect(_.size(sym.modules.get())).to.equal(0);
        });
    });

    describe('destroy()', function () {

        it('should destroy a module', function () {
            var name = _.uniqueId('module');
            var modules;

            sym.modules.create(name, mock.withSubscribe);

            modules = sym.modules.get();

            modules.should.have.property(name);
            sym.modules.destroy(name);
            modules.should.not.have.property(name);
        });
    });

    describe('create()', function () {
        it('should throw an error if module cant be created', function () {
            var mod = {};

            expect(function () {
                sym.modules.create(_.uniqueId('module'), mod);
            }).to.throw(Error);
        });

        it('should throw an error if module cant be initialized', function () {
            var mod = function (sandbox) { return {}; };

            expect(function () {
                sym.modules.create(_.uniqueId('module'), mod);
            }).to.throw(Error);
        });

        it('should create a new module', function () {
            var modules, name = _.uniqueId('module');
            
            sym.modules.create(name, mock.withSubscribe);

            modules = sym.modules.get();

            modules.should.have.property(name);
            modules[name].should.have.keys(['id','fn','createdAt','options']);
        });
    });

    describe('start()', function () {
        it('should start a module', function () {
            var name = _.uniqueId('module');
            var modules;

            sym.modules.create(name, mock.withSubscribe);

            modules = sym.modules.get();
            modules.should.have.property(name);
            modules[name].should.not.have.property('instance');
            
            sym.modules.start(name);
            modules[name].should.have.property('instance');
        });
    });


    describe('stop()', function () {
        it('should stop a module', function () {
            
        });
    });

    describe('startAll()', function () {

    });

    describe('stopAll()', function () {
        it('should stop all modules', function () {

        });
    });
});
