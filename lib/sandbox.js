define(['dom'], function ( $ )  {
    return {
        create: function ( core, selector ) {
            var DOMContainer = $('#' + selector);
            return {
                find: function () {},
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
