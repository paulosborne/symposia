define(['jquery'], function ( $ )  {
    return {
        sandbox: {
            create: function ( core, module ) {
                var $element = $('[data-symposia-module='+ module.name +']');
                return {
                    publish: function ( envelope ) {
                        core.events.publish( envelope );
                    },
                    subscribe: function ( subDef ) {
                        core.events.subscribe( subDef, module._id );
                    },
                    unsubscribeAll: function () {
                        core.events.unsubscribeAll( module._id);
                    },
                    find: function () {
                    },
                    container: function () {
                        return $element;
                    },
                    getModuleId: function () {
                        return module._id;
                    }
                };
            }
        }
    };
});
