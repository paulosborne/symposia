define(['src/core'], function ( core ) {

    core.modules = {
        /**
         * Get a module using its id
         *
         * @param { string } id
         * @return { object }
         */
        get: function ( id ) {
            if ( this.isModule( id ) ) {
                return core._modules[id];
            }
        },
        getModules: function () {
            return core._modules;
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

                if ( _.has( core._modules, moduleName )) {
                    return;
                }

                moduleId = _.uniqueId('module-');

                if ( !_.isFunction( mod.creator ) ) {
                    throw new Error("Creator should be an instance of Function");
                }

                temp = mod.creator( core.sandbox.create( moduleName ));

                if ( !_.isObject( temp ) ) {
                    throw new Error("Creator should return a public interface");
                }

                if ( !_.isFunction( temp.init ) && !_.isFunction( temp.destroy )) {
                    throw new Error("Module return an object containing both an init and destroy method");
                }

                temp = null;

                core._modules[moduleName] = {
                    _id: moduleId,
                    name: moduleName,
                    creator: mod.creator
                };
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
            var args = [].splice.call( arguments, 0 );

            if ( args.length ) {
                _.each( args, function ( mod, key ) {
                    if ( !this.isRunning( mod ) ) {

                        _.extend( core._modules[mod], {
                            instance: core._modules[mod].creator( core.sandbox.create( mod ) ),
                            started: new Date()
                        });

                        core._modules[mod].instance.init();
                    }
                }, this );
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
            return this.start.apply( this, _.keys( core._modules ) );
        },
        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function () {
            var args = [].splice.call( arguments, 0 );

            if ( !args.length ) {
                throw new Error('No module name supplied');
            }

            _.each( args, function ( mod ) {
                if( this.isRunning( mod ) ) {

                    core._modules[mod].instance.destroy();
                    core._modules[mod].instance = null;

                    core.events.unsubscribeAll( mod );

                    delete( core._modules[mod].instance );
                }
            }, this);

            return this;
        },
        /**
         * Stop all modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            var started = _.keys( core._modules );

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
            var running = _.filter( core._modules, function ( mod ) {
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
                return _.isObject( core._modules[name].instance );
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

            if ( !_.has( core._modules, name ) ) {
                throw new Error("Unable to find module '"+ name +"'");
            }

            return true;
        },
        reset: function () {
            this.stopAll();
            core._modules = {};
        }
    };

    return core.modules;

});
