define(['./view/toolbar.view','./collection/button.collection'], function ( Toolbar, ButtonCollection ) {
    return function ( sandbox ) {
        return {
            init: function () {

                var document_toolbar = new Toolbar({
                    el: sandbox.container.find('.btn-toolbar')
                });

            },
            destroy: function () {}
        };
    };
});
