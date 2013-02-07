define(['seed','sandbox'],function( seed, Sandbox ) {

    var moduleData = {};

    return {
        bootstrap: function ( modules ) {
            var i = 0,
                temp = {};

            for ( i; i < modules.length; i += 1 ) {
                if ( typeof modules[i].creator === 'function' ) {
                    temp = modules[i].creator(new Sandbox(seed, modules[i].element));

                } else {
                    throw new Error('Creator must be a function');
                }
            }

            return true;
        },
        audit: function () {
            return moduleData;
        }
    };
});
