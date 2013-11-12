define(function (require, exports) {

    var core        = require('src/core'),
        _strings    = require('config').strings;


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
                throw new Error(_strings.ERR_MODULE_DEF_NOT_OBJECT);
            }

            if ( !_.isUndefined( callback ) && !_.isFunction( callback ) ) {
                throw new Error(_strings.ERR_CALLBACK_NOT_FUNC);
            }

            _.each( moduleDef, function ( mod, name ) {
                var moduleId, temp;

                if ( _.has( core._modules, name )) {
                    return;
                }

                moduleId = _.uniqueId('module-');

                if (!_.isFunction( mod.creator )) {
                    throw new Error(_.template(_strings.ERR_MODULE_NOT_FUNC, { m: name }));
                }

                temp = mod.creator( core.sandbox.create( name ));

                if ( !_.isObject( temp ) ) {
                    throw new Error(_.template(_strings.ERR_MODULE_NO_API, { m: name }));
                }

                if ( !_.isFunction( temp.init ) && !_.isFunction( temp.destroy )) {
                    throw new Error(_.template(_strings.ERR_MODULE_MISSING_METHOD, { m: name }));
                }

                temp = null;

                core._modules[name] = {
                    _id: moduleId,
                    name: name,
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
            var args = [].slice.call( arguments );

            if ( args.length ) {
                _.each( args, function ( mod, key ) {
                    var sbx;
                    if ( !this.isStarted( mod ) ) {
                        sbx = core.sandbox.create(mod);

                        _.extend( core._modules[mod], {
                            sandbox: sbx,
                            instance: core._modules[mod].creator( sbx )
                        });

                        core._modules[mod].instance.init();
                        core.log('info', _.template(_strings.MODULE_STARTED, {
                            m: mod,
                            s: sbx.getId(),
                            t: new Date().getTime()
                        }));
                    }
                }, this );
            } else {
                throw new Error(_strings.ERR_MODULE_NO_NAME);
            }
            return this;
        },
        /**
         * Start all unstarted modules
         *
         */
        startAll: function () {
            return this.start.apply(this, _.keys( core._modules ) );
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
                throw new Error(_strings.ERR_MODULE_NO_NAME);
            }

            _.each( args, function ( mod ) {
                if( this.isStarted( mod ) ) {

                    core._modules[mod].instance.destroy();
                    core._modules[mod].instance = null;

                    core._modules[mod].sandbox.unsubscribeAll();

                    delete( core._modules[mod].instance );
                    delete( core._modules[mod].sandbox );

                    core.log('info', _.template(_strings.MODULE_STOPPED, { m: mod, t: new Date().getTime() }));
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
        getStarted: function () {
            var started = _.filter( core._modules, function ( mod ) {
                return _.has( mod, 'instance' );
            });
            return started;
        },
        /**
         * Is the module started?
         *
         * @param {string} id - the module to look for
         * @return {boolean}
         */
        isStarted: function ( name ) {
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
                throw new Error(_strings.ERR_MODULE_NO_NAME);
            }

            if ( !_.isString( name ) ) {
                throw new TypeError(_strings.ERR_MODULE_NAME_NOT_STR);
            }

            if ( !_.has( core._modules, name ) ) {
                throw new Error(_.template(_strings.ERR_MODULE_NOT_FOUND, { m: name }));
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
