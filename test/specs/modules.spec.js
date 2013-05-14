define(['symposia','test/mocks/modules'], function ( symposia, mods ) {
    describe('modules', function () {
        var moduleData = {};

        before(function() {

            this.started = [];
            this.stopped = [];

            moduleData = symposia.modules.create({
                'module_a': {
                    creator: mods.a
                },
                'module_b': {
                    creator: mods.b,
                    options: {
                        init: false
                    }
                }
            }, function ( data ) {
                return data;
            });

            symposia.bus.subscribe({
                channel: 'modules',
                topic: 'module.started',
                callback: function ( data, envelope ) {
                    this.started.push( data.id );
                }
            }).withContext( this );

            symposia.bus.subscribe({
                channel: 'modules',
                topic: 'module.stopped',
                callback: function ( data, envelope ) {
                    this.stopped.push( data.id );
                }
            }).withContext( this );

        });

        afterEach(function () {
            this.started = [];
            this.stopped = [];
            symposia.modules.stopAll();
        });

        describe('create()', function() {

            it('should create a module', function () {
                assert.isTrue( moduleData.hasOwnProperty('module_a') );
            });

            it('should (optionally) prevent modules from being initialized', function () {
                assert.isTrue( _.isNull( moduleData.module_b.instance ));
            });

        });

        describe('start()', function () {

            it('should automatically start modules by default', function () {
                symposia.modules.start('module_a');
                assert.includeMembers( this.started, ['module_a'] );
            });

            it('should announce when a module starts', function () {
                symposia.modules.start('module_b');
                assert.includeMembers(this.started,['module_b']);
            });

            it('should throw an error if attempting to start an invalid module', function () {
                // passing no module name
                assert.throws(function () {
                    symposia.modules.start();
                }, Error, 'No moduleId supplied' );

                // passing a invalid module name
                assert.throws(function () {
                    symposia.modules.start('module_z');
                }, Error, 'Unable to find module [module_z]' );

                // passing a non-string
                assert.throws(function () {
                    symposia.modules.start( 12345 );
                }, Error, 'moduleId must be a string, number supplied' );
            });

            it('should return false if attempting to start a running module', function () {
                symposia.modules.start('module_b');
                assert.isFalse( symposia.modules.start('module_b') );
            });

            it('should return true if a module starts successfully', function () {
                assert.isTrue( symposia.modules.start('module_a') );
            });
        });

        describe('stop()', function () {

            it('should return false if trying to stop an inactive module', function () {
                assert.isFalse( symposia.modules.stop('module_a') );
            });

            it('should announce when a module stops', function () {
                symposia.modules.start('module_a');
                symposia.modules.stop('module_a');
                assert.includeMembers( this.stopped, ['module_a'] );
            });
        });

        describe('stopAll()', function () {
            it('should stop all active modules', function () {
                symposia.modules.start('module_a');
                symposia.modules.start('module_b');
                symposia.modules.stopAll();

                assert.includeMembers( this.stopped, ['module_a','module_b'] );
            });
        });

        describe('hasModules()', function () {
            it('should return true if there are modules', function () {
                assert.isTrue( symposia.modules.hasModules() );
            });
        });


        describe('isStarted()', function () {
            it('isStarted() should return true if module is started', function () {
                symposia.modules.start('module_a');
                assert.isTrue( symposia.modules.isStarted('module_a') );
            });
            it('isStarted() should return false if module is stopped', function () {
                assert.isFalse( symposia.modules.isStarted('module_a') );
            });
        });

        describe('isModule()', function () {

            it('should throw ERROR if no name is passed', function () {
                assert.throws( function () {
                    symposia.modules.isModule();
                }, Error, 'No moduleId supplied');
            });

            it('should return FALSE if module name is not a string', function () {
                assert.throws(function () {
                    symposia.modules.isModule(12345);
                }, Error, 'moduleId must be a string, number supplied');
            });

            it('should return FALSE if module does not exist', function () {
                assert.throws(function () {
                    symposia.modules.isModule('module_z');
                }, Error, 'Unable to find module [module_z]');
            });

            it('should return TRUE if module exists', function () {
                assert.isTrue( symposia.modules.isModule('module_a') );
            });

        });
    });
});
