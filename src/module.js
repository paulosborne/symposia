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
            if (!core._modules[id]) {
                throw new Error(_.template(_strings.ERR_MODULE_NOT_FOUND, { m: id }));
            }
            return core._modules[id];
        },
        /**
         * Create a module
         *
         * @param { object } modules
         * @param { function } callback
         * @param { object } context
         */
        create: function (moduleDef) {
            var mod, moduleName;

            if ( typeof moduleDef !== 'object' ) {
                throw new Error(_strings.ERR_MODULE_DEF_NOT_OBJECT);
            }

            _.each( moduleDef, function ( mod, name ) {
                var temp;

                if ( _.has(core._modules, name)) {
                    return;
                }

                if (!_.isFunction( mod.creator )) {
                    throw new Error(_.template(_strings.ERR_MODULE_NOT_FUNC, { m: name }));
                }

                temp = mod.creator( core.sandbox.create( name ));

                if ( !_.isObject( temp ) ) {
                    throw new Error(_.template(_strings.ERR_MODULE_NO_API, { m: name }));
                }

                if ( !_.isFunction( temp.init )) {
                    throw new Error(_.template(_strings.ERR_MODULE_MISSING_METHOD, { m: name }));
                }

                temp = null;

                core._modules[name] = {
                    _id     : _.uniqueId('module-'),
                    name    : name,
                    creator : mod.creator
                };
            }, this);

            return this;
        },
        /**
         * Start module(s).
         *
         * Can be used to start a single or multiple modules by either passing
         * in each module name, or module objects.
         *
         * @param {string} - name of the module to start
         * @param {object} - module
         * @return { boolean }
         */
        start: function () {
            var args = [].slice.call( arguments );

            try {
                _.each(args, function (m, i) {
                    var mod     = _.isString(m) ? this.get(m) : m,
                        sandbox = core.sandbox.create(m.name);

                    mod.sandbox  = sandbox;
                    mod.instance = mod.creator(sandbox);
                    mod.instance.destroy = mod.instance.destroy || function () {};
                    mod.instance.init();

                    core.log('info', _.template(_strings.MODULE_STARTED, { m: mod.name }));

                }, this);
            } catch (e) {
                core.log('info', e.message);
            }
        },
        /**
         * Stop a module
         *
         * @param { string } id - the id of the module to stop
         * @return { boolean }
         */
        stop: function () {
            var args = [].slice.call( arguments );

            if ( !args.length ) {
                return;
            }

            _.each(args, function ( mod ) {
                mod.instance.destroy();
                mod.instance = null;
                mod.sandbox.unsubscribeAll();

                delete( mod.instance );
                delete( mod.sandbox );

                core.log('info', _.template(_strings.MODULE_STOPPED, { m: mod.name }));
            });

            return args.length;
        },
        /**
         * Start all unstarted modules
         *
         */
        startAll: function () {
            this.start.apply(this, this.getStopped());
        },
        /**
         * Stop all started modules
         *
         * @return {boolean}
         */
        stopAll: function () {
            console.log(this.stop.apply(this, this.getStarted()));
        },
        /**
         * Returns all started modules
         *
         * @return {array}
         */
        getStarted: function () {
            return _.filter( core._modules, function ( mod ) {
                return _.has( mod, 'instance' );
            });
        },
        /**
         * Returns all stopped modules
         */
        getStopped: function () {
            return _.filter(core._modules, function (mod) {
                return !_.has(mod, 'instance');
            });
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
            if (!_.has( core._modules, name )) {
                throw new Error(_strings.ERR_MODULE_NOT_FOUND);
            }
            return core._modules[name];
        },
        reset: function () {
            this.stopAll();
            core._modules = {};
        }
    };

    return core.modules;

});
