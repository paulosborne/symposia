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

            it('should fire callback if provided', function () {
                var callback = sinon.spy();

                symposia.modules.create({
                    'module-1': { creator: mods.a }
                }, callback );

                assert.isTrue( callback.called );
                assert.equal( callback.callCount, 1 );
                assert.lengthOf( callback.args[0], 1 );
                assert.isObject( callback.args[0][0] );
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

            it('should return false if trying to stop an inactive module', function () {
                assert.isFalse( symposia.modules.stop('module_a') );
            });

            it('should announce when a module stops', function () {
                symposia.modules.start('module_a');
                symposia.modules.stop('module_a');
                assert.includeMembers( this.stopped, ['module_a'] );
            });

            it('should return true if module stops', function () {
                symposia.modules.start('module_a');
                assert.isTrue( symposia.modules.stop('module_a') );
            });
        });

        describe('stopAll', function () {

            it('should stop all active modules', function () {
                symposia.modules.start('module_a');
                symposia.modules.start('module_b');
                symposia.modules.stopAll();

                assert.includeMembers( this.stopped, ['module_a','module_b'] );
            });

        });

        describe('hasModules', function () {
            it('should be truthy if there are modules', function () {
                assert.isTrue( symposia.modules.hasModules() );
            });
        });


        describe('isStarted', function () {
            it('should be truthy if module is started', function () {
                symposia.modules.start('module_a');
                assert.isTrue( symposia.modules.isStarted('module_a') );
            });
            it('should be falsy if module is stopped', function () {
                assert.isFalse( symposia.modules.isStarted('module_a') );
            });
        });

        describe('isModule', function () {
            it('should throw descriptive errors if invalid id', function () {
                assert.throws( function () {
                    symposia.modules.isModule();
                }, Error, 'No id supplied');
                assert.throws(function () {
                    symposia.modules.isModule(12345);
                }, Error, 'id must be a string, number supplied');
                assert.throws(function () {
                    symposia.modules.isModule('module_z');
                }, Error, 'Unable to find module [module_z]');
            });

            it('should be truthy if module exists', function () {
                assert.isTrue( symposia.modules.isModule('module_a') );
            });
        });

        describe('getStarted', function () {
            it('should return an array of modules that are currently active', function () {
                var started = [];
                symposia.modules.start('module_a');
                started = symposia.modules.getStarted();
                assert.isTrue( _.isArray( started ) );
                assert.lengthOf( started, 1 );
                assert.property( started[0], '_id');
                assert.property( started[0], 'name');
                assert.property( started[0], 'creator');
                assert.property( started[0], 'instance');
            });

            it('should return an empty array if no modules are active', function () {
                assert.lengthOf( symposia.modules.getStarted(), 0);
            });

        });
    });

});
