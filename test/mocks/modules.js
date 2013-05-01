define(['./example.view.js'], function( ExampleView ) {
    return {
        'a': function ( sandbox ) {
            return {
                init: sinon.spy( function () {
                    console.log( new ExampleView() );
                }),
                destroy: sinon.spy( function() {

                })
            };
        },
        'b': function ( sandbox ) {
            return {
                init: sinon.spy(function() {
                }),
                destroy: sinon.spy(function() {
                }),
                receive: sinon.spy(function( value ) {
                })
            };
        },
        'c': function ( sandbox ) {
            return {
                init: sinon.spy(function() {
                }),
                destroy: sinon.spy(function() {
                })
            };
        }
    };
});
