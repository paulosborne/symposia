define(['symposia'], function ( symposia ) {

    var ExampleView = {
        initialize: function () {

            symposia.bus.publish({
                channel: 'views',
                topic: 'module.loaded',
                data: {
                    id: 'example.view'
                }
            });

        },
        render: function () {
        }
    };

    return symposia.mvc.View( ExampleView );

});
