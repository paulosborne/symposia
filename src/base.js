(function() {
    var config = {
        require: {
            shim: {
                hasher: ['signals'],
                crossroads : ['signals','hasher'],
                postal: ['underscore']
            },
            paths: {
                postal     : 'vendor/postaljs/lib/postal.min',
                signals    : 'node_modules/signals/dist/signals',
                hasher     : 'node_modules/hasher/dist/js/hasher',
                crossroads : 'node_modules/crossroads/dist/crossroads'
            }
        }
    };

    require.config( config.require );

    define(function (require) {
        return { 
            bus     : require('postal'),
            router  : require('crossroads'),
            hash    : require('hasher')
        };
    });

}());
