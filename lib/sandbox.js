define(['lib/dom'], function ( $ )  {
    return {
        create: function ( core, selector ) {

            var DOMContainer = $('#' + selector);

            return {
                container: DOMContainer,
                find: function ( query ) {
                    if ( DOMContainer !== undefined && typeof DOMContainer.find === 'function' ) {
                       return DOMContainer.find( query );
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
