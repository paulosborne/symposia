define(['lib/core','../collection/button.collection','./button_group.view'],
    function ( core, ButtonCollection, ButtonGroupView ) {
        var Toolbar = {};

        Toolbar.initialize = function () {

            var buttons = [
                { group: 1, icon: 'fast-backward' },
                { group: 1, icon: 'step-backward'},
                { group: 1, icon: 'step-forward'},
                { group: 1, icon: 'fast-forward'},
                { group: 2, icon: 'undo', action: 'rotate-left'},
                { group: 2, icon: 'repeat', action: 'rotate-right'},
                { group: 2, icon: 'resize-vertical'},
                { group: 2, icon: 'resize-horizontal'},
                { group: 2, icon: 'zoom-in'},
                { group: 2, icon: 'zoom-out'},
                { group: 3, icon: 'envelope'},
                { group: 3, icon: 'link'},
                { group: 3, icon: 'trash'},
                { group: 3, icon: 'print'},
                { group: 3, icon: 'cog'},
                { group: 4, icon: 'cog', style: 'btn-primary' }
            ];

            this.buttonGroups = _.groupBy(buttons,'group');
            this.render();
        };

        Toolbar.render = function () {
            var _this = this,
                renderedButtonGroups = [];

            _.each( this.buttonGroups, function ( bg ) {
                var view = new ButtonGroupView({
                    collection: new ButtonCollection( bg )
                });
                renderedButtonGroups.push(view.render().el);
            });

            this.$el.html( renderedButtonGroups );
            return this;
        };

        return core.mvc.View ( Toolbar );
    }
);
