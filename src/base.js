(function() {
    var config = {
        require: {
            shim: {
                jquery     : { exports: '$' },
                underscore : { exports: '_' }
            },
            postal: ['underscore'],
            deps:['jquery','es5shim'],
            paths: {
                jquery     : 'vendor/jquery/jquery',
                underscore : 'vendor/lodash/lodash',
                postal     : 'vendor/postaljs/lib/postal.min',
                es5shim    : 'vendor/es5-shim/es5-shim'
            }
        }
    };

    require.config( config.require );

    define(['postal'], function ( postal ) {
        return { bus: postal };
    });

}());
