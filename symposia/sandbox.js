define(['jquery'], function ( $ )  {

    var Sandbox = function ( symposia, module ) {
        this.element = $('#'+ module.id);
        return {

        };
    };

    Sandbox.prototype = {

    };

    /*
    return {
        create: function ( symposia, selector ) {
            var element = $('#' + selector);

            return {
                container: element,
                find: function ( query ) {
                    if ( element !== undefined && typeof element.find === 'function' ) {
                       return element.find( query );
                    }
                    return $(query);
                },
                listen: function ( events ) {
                    symposia.events.subscribe( events, selector);
                },
                notify: function ( notification ) {
                    symposia.events.publish( notification );
                },
                subscribe: function ( subDef ) {
                },
                publish: function ( envelope ) {
                }
            };
        }
    };*/

    return Sandbox;
});
