define(['lib/core','text!../template/button.tmpl.html'], function( core, _button ) {

    var Button = {
        tagName: 'button',
        className: 'btn',
        template: _button,
        events: {
            'click' : 'clicked'
        }
    };

    Button.initialize = function() {
        this.render();
    };

    Button.render = function () {

        // adds a custom css style to the button.
        if ( this.model.has('style') ) {
            this.$el.addClass( this.model.get('style'));
        } else {
            this.$el.addClass('btn-custom-dark-grey');
        }

        this.$el.html(_.template(this.template, this.model.toJSON() ));

        return this;
    };

    Button.clicked = function ( ) {
        core.events.publish({
            type: 'document_toolbar.button_click',
            data: this.model
        });
    };

    return core.mvc.View( Button );
});
