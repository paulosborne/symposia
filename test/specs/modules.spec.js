define(['symposia','test/mocks/modules'], function ( symposia, mods ) {
    describe('Core.Modules', function () {
        var moduleData = {};

        describe('create', function() {

            it('should create a module', function () {
                var created = symposia.modules.create({
                    'module-1': { creator: mods.a },
                    'module-2': { creator: mods.b }
                }).getModules();
                assert.property( created, 'module-1' );
                assert.property( created, 'module-2' );
                assert.equal( _.size( created ), 2 );
            });

            it('issue#2', function () {
                var mod;
                symposia.modules.create({ 'ABC': { creator: mods.d } }).startAll();
                mod = symposia.modules.getModules();
                assert.isTrue( mod.ABC.instance.init.called );
            });

            it('should throw an error if no modules object is passed', function () {
                assert.throws(function() {
                    symposia.modules.create('fred');
                }, Error, 'Create must be passed an object');
            });

            it('should throw an error if callback is not a function', function () {
                assert.throws(function() {
                    symposia.modules.create({
                        'invalidCallback': {
                            creator: mods.a
                        }
                    }, 'hello');
                }, Error, 'Callback must be a function');
            });


            it('should throw an error if no creator is passed', function () {
                assert.throws( function () {
                    symposia.modules.create({
                        'noCreator': {
                            creator: null
                        }
                    });
                }, Error, 'Creator should be an instance of Function');
            });

            it('should throw an error if creator function doesnt return a public interface', function () {
                assert.throws(function () {
                    symposia.modules.create({
                        'noPublicInterface': {
                            creator: function () {}
                        }
                    });
                }, Error, 'Creator should return a public interface');
            });

            afterEach(function () {
                symposia.modules.reset();
            });

        });

        describe('start', function () {
            it('should throw an error when attempting to start a non-existent module', function () {
                assert.throws(function () {
                    var created = symposia.modules.create({
                        'ABC': { creator: mods.a },
                        'DEF': { creator: mods.b }
                    }).start('ABC','DEF','ABC','GHI');
                }, Error, "Unable to find module 'GHI'" );
            });

            it('should throw an error if no module name supplied', function () {
                assert.throws(function () {
                    symposia.modules.start();
                }, Error, 'No module name supplied' );
            });

            it('should throw an error if a non-string param is passed', function () {
                assert.throws(function () {
                    symposia.modules.start( 12345 );
                }, TypeError,'Module name must be a string');
            });

            afterEach(function () {
                symposia.modules.reset();
            });
        });

        describe('stop', function () {
            it('should only stop if module has an instance', function () {
                symposia.modules.create({
                    'ABC': { creator: mods.a },
                    'DEF': { creator: mods.a },
                    'GHI': { creator: mods.a }
                }).start('ABC','DEF','GHI');

                assert.equal( _.size( symposia.modules.getRunning()), 3);
                assert.isTrue( symposia.modules.isRunning('DEF') );

                symposia.modules.stop('DEF');

                assert.equal( _.size( symposia.modules.getRunning()), 2);
                assert.isFalse( symposia.modules.isRunning('DEF') );
            });
        });

        describe('stopAll', function () {

            it('should stop all active modules', function () {

                symposia.modules.create({
                    'ABC': { creator: mods.a },
                    'DEF': { creator: mods.b },
                    'GHI': { creator: mods.c }
                }).start('ABC','DEF','GHI');

                assert.equal( _.size( symposia.modules.getRunning()), 3);
                symposia.modules.stopAll();
                assert.equal( _.size( symposia.modules.getRunning()), 0);
            });
        });

        describe('isRunning', function () {
            before(function () {
                symposia.modules.create({
                    'ABC': { creator: mods.a },
                    'DEF': { creator: mods.b },
                    'GHI': { creator: mods.c }
                }).start('ABC');
            });

            it('should return true if module is running', function () {
                assert.isTrue( symposia.modules.isRunning('ABC') );
            });

            it('should return false if module is not running', function () {
                assert.isFalse( symposia.modules.isRunning('DEF') );
                assert.isFalse( symposia.modules.isRunning('GHI') );
            });

            after(function() {
                symposia.modules.reset();
            });
        });

        describe('isModule', function () {
            it('should throw error if no name supplied', function () {
                assert.throws( function () {
                    symposia.modules.isModule();
                }, Error);
            });

            it('should throw error if non-string passed', function () {
                assert.throws(function () {
                    symposia.modules.isModule(12345);
                }, Error);
            });

            it('should throw error module does not exist', function () {
                assert.throws(function () {
                    symposia.modules.isModule('module_z');
                }, Error );
            });

            it('should be truthy if module exists', function () {
                symposia.modules.create({
                    'ABC': { creator: mods.a }
                }).start('ABC');

                assert.isTrue( symposia.modules.isModule('ABC') );
            });
        });

        describe('getRunning', function () {
            it('should return an array of modules that are currently active', function () {
                var running;

                symposia.modules.create({
                    'ABC': { creator: mods.a },
                    'DEF': { creator: mods.b },
                    'GHI': { creator: mods.c }
                }).startAll();

                running = symposia.modules.getRunning();

                assert.lengthOf( running, 3 );
                assert.isTrue( _.isArray( running ) );
            });
        });
    });

});
