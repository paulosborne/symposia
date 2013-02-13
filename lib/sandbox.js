define(['dom'], function ( $ )  {
    return {
        create: function ( core, selector ) {

            var DOMContainer = $('#' + selector);

            return {
                find: function () {},
                mvc: core.mvc,
                /*
                 * Observer API
                 */
                listen: function ( eventObj ) {
                    var e;
                    for ( e in eventObj ) {
                        if ( eventObj.hasOwnProperty(e) ) {
                            core.events.register( e, selector);
                        }
                    }
                },
                notify: function ( eventObj, context ) {
                    core.events.trigger( eventObj, context );
                },
                list: core.events.list
            };
        }
    };
});
