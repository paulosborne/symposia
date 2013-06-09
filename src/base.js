(function() {
    var config = {
        require: {
            shim: {
                jquery     : { exports: '$' },
                underscore : { exports: '_' },
                crossroads : ['signals'],
                postal: ['underscore']
            },
            deps:['jquery','es5shim'],
            paths: {
                jquery     : 'vendor/jquery/jquery',
                underscore : 'vendor/lodash/lodash',
                postal     : 'vendor/postaljs/lib/postal.min',
                es5shim    : 'vendor/es5-shim/es5-shim',
                signals    : 'node_modules/signals/dist/signals.min',
                crossroads : 'node_modules/crossroads/dist/crossroads.min'
            }
        }
    };

    require.config( config.require );

    define(['postal','crossroads'], function ( postal, cr) {
        return { bus: postal, router: cr };
    });

}());
