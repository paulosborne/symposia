define(function() {
    return {
        'a': function ( sandbox ) {
            return {
                init: sinon.spy( function () {}),
                destroy: sinon.spy( function() {
                }),
                notify: sinon.spy(function () {
                    sandbox.publish({
                        topic: 'document.view',
                        data: {
                            status: 200
                        }
                    });
                })
            };
        },
        'b': function ( sandbox ) {
            return {
                init: sinon.spy(function() {}),
                destroy: sinon.spy(function() {}),
                listen: sinon.spy(function( callback ) {
                    sandbox.subscribe({
                        topic: 'document.view',
                        callback: callback
                    });
                })
            };
        },
        'c': function ( sandbox ) {
            return {
                init: sinon.spy(function() {}),
                destroy: sinon.spy(function() {})
            };
        }
    };
});
