define(['jquery'], function ( $ )  {
    return {
        create: function ( core, selector ) {

            var element = $('#' + selector);

            return {
                container: element,
                find: function ( query ) {
                    if ( element !== undefined && typeof element.find === 'function' ) {
                       return element.find( query );
                    }
                    return $(query);
                },
                mvc: core.mvc,
                listen: function ( events ) {
                    core.events.subscribe( events, selector);
                },
                notify: function ( notification ) {
                    core.events.publish( notification );
                }
            };
        }
    };
});
