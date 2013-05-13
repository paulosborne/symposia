define(function() {
    return {
        'a': function ( sandbox ) {
            return {
                init: sinon.spy( function () {}),
                destroy: sinon.spy( function() {})
            };
        },
        'b': function ( sandbox ) {
            return {
                init: sinon.spy(function() {}),
                destroy: sinon.spy(function() {}),
                receive: sinon.spy(function( value ) {})
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
