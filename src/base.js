(function() {
    var config = {
        require: {
            shim: {
                jquery: { exports: '$' },
                underscore: { exports: '_' }
            },
            postal: ['underscore'],
            deps:['jquery'],
            paths: {
                jquery: 'vendor/jquery/jquery',
                underscore: 'vendor/lodash/lodash',
                postal: 'vendor/postaljs/lib/postal.min'
            }
        }
    };

    require.config( config.require );

    define(['postal'], function ( postal ) {
        return { bus: postal };
    });

}());
