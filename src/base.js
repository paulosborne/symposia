(function() {
    var config = {
        require: {
            shim: {
                jquery     : { exports: '$' },
                underscore : { exports: '_' },
                hasher: ['signals'],
                crossroads : ['signals','hasher'],
                postal: ['underscore']
            },
            deps:['jquery','es5shim'],
            paths: {
                jquery     : 'vendor/jquery/jquery',
                underscore : 'vendor/lodash/lodash',
                postal     : 'vendor/postaljs/lib/postal.min',
                es5shim    : 'vendor/es5-shim/es5-shim',
                signals    : 'node_modules/signals/dist/signals',
                hasher     : 'node_modules/hasher/dist/js/hasher',
                crossroads : 'node_modules/crossroads/dist/crossroads'
            }
        }
    };

    require.config( config.require );

    define(['postal','crossroads','hasher'], function ( postal, cr, hash ) {
        return { bus: postal, router: cr, hash: hash };
    });

}());
