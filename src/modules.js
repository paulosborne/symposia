define(['src/core'], function ( core ) {

    var _modules = {};

    core.modules = {
        /**
         * Get a module using its id
         *
         * @param { string } id
         * @return { object }
         */
        get: function ( id ) {
            if ( this.isModule( id ) ) {
                return _modules[id];
            }
        },
        getModules: function () {
            return _modules;
        },
        /**
         * Create a module
         *
         * @param { object } modules
         * @param { function } callback
         * @param { object } context
         */
        create: function ( moduleDef, callback, context ) {
            var mod, moduleName;

            if ( typeof moduleDef !== 'object' ) {
                throw new Error('Create must be passed an object');
            }

            if ( !_.isUndefined( callback ) && !_.isFunction( callback ) ) {
                throw new Error('Callback must be a function');
            }

            _.each( moduleDef, function ( mod, moduleName ) {
                var moduleId, temp;
                // return if moduleName already exists.
                //
                 if ( _.has( _modules, moduleName )) return;

                moduleId = _.uniqueId('module-');

                if ( !_.isFunction( mod.creator ) ) {
                    throw new Error("Creator should be an instance of Function");
                }

                console.log( core );


                temp = mod.creator( core.sandbox.create( core, moduleName ));

                if ( !_.isObject( temp ) ) {
                    throw new Error("Creator should return a public interface");
                }

                if ( !_.isFunction( temp.init ) && !_.isFunction( temp.destroy )) {
                    throw new Error("Module return an object containing both an init and destroy method");
                }

                temp = null;

                _modules[moduleName] = {
                    _id: moduleId,
                    name: moduleName,
                    creator: mod.creator
                };

                core.bus.publish({
                    channel: 'modules',
                    topic: 'created',
                    envelope: {
                        moduleName: moduleName,
                        moduleId: _modules[moduleName]._id
                    }
                });

            }, this);

            return this;
        },
        /**
         * Start a module
         *
         * @param { array } arguments - comma seperated list of modules to start
         * @return { boolean }
         */
        start: function () {
            var _this = this,
                args = [].splice.call( arguments, 0 );

            if ( args.length ) {
                _.each( args, function ( mod, key ) {
                    if ( !_this.isRunning( mod ) ) {
                        // start & initialize module.
                        _modules[mod].instance = _modules[mod].creator( core.sandbox.create( core, mod ));
                        _modules[mod].instance.init();
                        // announce
                        core.bus.publish({ channel: 'modules', topic: 'module.started', data: { module: mod } });
                    }
                });
            } else {
                throw new Error("No module name supplied");
            }
            return this;
        },
        /**
         * Start all unstarted modules
         *
         */
        startAll: function () {
            return this.start.apply( this, _.keys( _modules ) );
        },

        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function () {
            var _this = this,
                args = [].splice.call( arguments, 0 );

            if ( !args.length ) {
                throw new Error('No module name supplied');
            }

            _.each( args, function ( mod ) {
                if( _this.isRunning( mod ) ) {

                    _modules[mod].instance.destroy();
                    _modules[mod].instance = null;

                    core.events.unsubscribeAll( mod );
                    core.bus.publish({ channel: 'modules', topic: 'module.stopped', data: { name: mod } });

                    delete( _modules[mod].instance );
                }
            });

            return this;
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            var started = _.keys( _modules );

            if ( started.length ) {
                this.stop.apply( this, started );
            }

            return this;
        },
        /**
         * Returns all started modules
         *
         * @return {array}
         */
        getRunning: function () {
            var running = _.filter( _modules, function ( mod ) {
                return _.has( mod, 'instance' );
            });
            return running;
        },
        /**
         * Is the module started?
         *
         * @param {string} id - the module to look for
         * @return {boolean}
         */
        isRunning: function ( name ) {
            if ( this.isModule( name ) ) {
                return _.isObject( _modules[name].instance );
            }
        },
        /**
         * Does the supplied module name resolve to a module
         *
         * @param {string} name - the module to check
         * @return {boolean}
         */
        isModule: function ( name ) {
            if ( _.isUndefined( name ) ) {
                throw new Error('No module name supplied');
            }

            if ( !_.isString( name ) ) {
                throw new TypeError('Module name must be a string');
            }

            if ( !_.has( _modules, name ) ) {
                throw new Error("Unable to find module '"+ name +"'");
            }

            return true;
        },
        reset: function () {
            _modules = {};
        }
    };

    return core.modules;

});
