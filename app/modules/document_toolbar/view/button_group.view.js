define(['lib/core','./button.view'], function ( core, Button ) {

    var ButtonGroup = {
        className: 'btn-group'
    };

    ButtonGroup.initialize = function () {
        this.render();
    };

    ButtonGroup.render = function () {
        var _this = this, buttons = [];

        this.collection.each(function( model ) {
            var button = new Button({
                model: model
            });
            buttons.push(button.render().el);
        });

        this.$el.html(buttons);
        return this;
    };

    return core.mvc.View( ButtonGroup );

});
