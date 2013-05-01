define(['symposia/lib/jquery'], function ( $ )  {
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
                mvc: symposia.mvc,
                messageBus: symposia.messageBus
            };
        },
    };
});
