(function() {

    var config = {
        require: {
            shim: {
                hasher      : ['signals'],
                crossroads  : ['signals','hasher'],
                postal      : ['underscore']
            },
            paths: {
                postal      : 'vendor/postaljs/lib/postal',
                signals     : 'node_modules/signals/dist/signals',
                hasher      : 'node_modules/hasher/dist/js/hasher',
                crossroads  : 'node_modules/crossroads/dist/crossroads'
            }
        }
    };

    if (window.jQuery) {
        define('jquery', [], function () {
            return window.jQuery;
        });
    } else {
        config.require.paths.jquery     = 'vendor/jquery/jquery';
        config.require.shim.jquery      = { exports: '$' };
    }


    if (window._) {
        define('underscore', [], function () {
            return window._;
        });
    } else {
        config.require.paths.underscore     = 'vendor/lodash/lodash';
        config.require.shim.underscore      = { exports: '_' };
    }

    require.config( config.require );

    define(['postal','crossroads','hasher'], function (postal,crossroads,hasher) {
        return {
            bus     : postal,
            router  : crossroads,
            hash    : hasher
        };
    });

}());
