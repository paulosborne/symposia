define(['lib/eventemitter2','src/seed'], function( EventEmitter, symposia ) {

    symposia.events = {
        subscribe: function ( obj, id ) {
            _.extend(moduleData[id].events,obj);
        },
        publish: function ( ev ) {
            var i;
            if (_.has( ev,'type') === false ) {
                throw new Error('emit expects eventObject to have a type property');
            }
            for ( i in moduleData ) {
                // check to see if the current module has an event that matches
                // the value of ev.type.
                if ( moduleData.hasOwnProperty(i) && _.has(moduleData[i].events,ev.type)) {
                    moduleData[i].events[ev.type](ev.data);
                }
            }
        },
        unsubscribe: function () {

        }
    };

    symposia.bus = new EventEmitter({
        wildcard: true,
        maxListeners: 20,
        verbose: true
    });

    return symposia;
});
