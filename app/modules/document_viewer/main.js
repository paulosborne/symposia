define(function () {
    return function ( sandbox ) {
        return {
            init: function () {
                sandbox.listen({
                    'document_toolbar.button_click': this.toolbar.bind(this)
                });

            },
            destroy: function () {

            },
            toolbar: function ( data ) {
                if( data.has('action')) {
                    console.log(data.get('action'));
                }
            },
            rotate: function ( data ) {
                console.log( data );
            },
            navigate: function ( data ) {
                console.log('navigate');
            },
            zoom: function ( data ) {
                console.log('zoom');
            }
        };
    };
});
