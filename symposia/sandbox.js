define(['jquery'], function ( $ )  {
    return {
        create: function ( core, id ) {
            var $element = $('[data-symposia-module='+ id +']');
            return {
                publish: function ( envelope ) {
                    core.events.publish( envelope );
                },
                subscribe: function ( subDef ) {
                    core.events.subscribe( subDef );
                },
                unsubscribe: function () {
                    core.events.unsubscribeAll( id );
                },
                find: function () {
                },
                container: function () {
                    return $element;
                }
            }
        }
    }
});
