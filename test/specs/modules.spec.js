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

        describe('validating modules', function () {

            it('should return FALSE if no name is passed', function () {
                assert.isFalse( symposia.modules.isModule() );
            });

            it('should return FALSE if module name is not a string', function () {
                assert.isFalse( symposia.modules.isModule(12345) );
            });

            it('should return FALSE if module does not exist', function () {
                assert.isFalse( symposia.modules.isModule('randomModuleName') );
            });

            it('should return TRUE if module exists', function () {
                assert.isTrue( symposia.modules.isModule('module_a') );
            });

        });

        describe('creating a module', function() {

            it('should create a module', function () {
                assert.isTrue( moduleData.hasOwnProperty('module_a') );
            });

            it('should initialize module by default', function () {
                symposia.modules.start('module_a');
                assert.includeMembers( this.started, ['module_a'] );
            });

            it('should (optionally) prevent modules from being initialized', function () {
                assert.isTrue( _.isNull( moduleData.module_b.instance ));
            });

        });

        describe('starting a module', function () {
            it('should announce when a module starts', function () {

                // start module_b
                symposia.modules.start('module_b');

                // assert module has been started
                assert.includeMembers(this.started,['module_b']);
            });

            it('should throw an error if attempting to start an invalid module', function () {
                // passing no module name
                assert.throws(function () {
                    symposia.modules.start();
                }, Error, 'Invalid module ID, unable to start' );

                // passing a invalid module name
                assert.throws(function () {
                    symposia.modules.start('module_z');
                }, Error, 'Invalid module ID, unable to start' );

                // passing a non-string
                assert.throws(function () {
                    symposia.modules.start( 12345 );
                }, Error, 'Invalid module ID, unable to start' );
            });

            it('should return false if attempting to start a running module', function () {
                symposia.modules.start('module_b');
                assert.isFalse( symposia.modules.start('module_b') );
            });

            it('should return true if a module starts successfully', function () {

            });
        });

        describe('stopping a module', function () {
            it('should return false if trying to stop an inactive module', function () {
                assert.isFalse( symposia.modules.stop('module_a') );
            });

            it('should announce when a module stops', function () {
                symposia.modules.start('module_a');
                symposia.modules.stop('module_a');
                assert.includeMembers( this.stopped, ['module_a'] );
            });
        });

    });
});
