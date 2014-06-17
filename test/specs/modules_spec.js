/* global Symposia , io*/
describe('Modules', function () {
    var mock = Symposia.Mocks;
    var socket = io.connect(window.location.hostname);

    var sym = new Symposia({
        modules: {
            'example': mock.withSubscribe
        },
        ws: socket
    });

    describe('destroyAll()', function () {
        it('should destroy all modules', function () {
            var modules;

            _.times(100, function () {
                sym.modules.create(_.uniqueId('module'), mock.withSubscribe);
            });

            expect(_.size(sym.modules.getModules())).to.equal(100);

            sym.modules.destroyAll();

            expect(_.size(sym.modules.getModules())).to.equal(0);
        });
    });

    describe('destroy()', function () {
        it('should destroy a module', function () {
            var name = _.uniqueId('module');
            var modules;

            sym.modules.create(name, mock.withSubscribe);

            modules = sym.modules.getModules();

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

            modules = sym.modules.getModules();

            modules.should.have.property(name);
            modules[name].should.have.keys(['id','seed','createdAt']);
        });
    });

    describe('start()', function () {
        it('should start a module', function () {
            var name = _.uniqueId('module');
            var modules;

            sym.modules.create(name, mock.withSubscribe);

            modules = sym.modules.getModules();
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