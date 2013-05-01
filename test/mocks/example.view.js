define(['symposia'], function ( symposia ) {

    return symposia.mvc.View({
        initialize: function () {
            symposia.messageBus.publish({
                topic: 'initialized',
                data: {
                    statusCode: 200
                }
            });
        },
        render: function () {

        }
    });

});
