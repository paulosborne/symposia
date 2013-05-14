define(['jquery'], function ( $ )  {
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
                    sandbox.subscribe({

                },
                subscribe: function ( config ) {
                    // create new subscription
                    var subcription = symposia.bus.subscribe( config );
                    // add subscription to module
                    symposia.modules.get( moduleId ).subscriptions.push( subscription );
                    // return subscription
                    return subDef;
                },
                subscribeOnce: function ( config ) {
                    this.subscribe( config ).once();
                }
            };
        }
    };
});
