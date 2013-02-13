define(["backbone"], function ( Backbone ) {
    return {
        util: {},
        dom: {},
        mvc: {
            View: function ( view ) {
                return Backbone.View.extend(view);
            },
            Model: function ( model ) {
                return Backbone.Model.extend(model);
            },
            Collection: function ( collection ) {
                return Backbone.Collection.extend(collection);
            },
            Router: function ( router ) {
                return Backbone.Router.extend(router);
            },
            Backbone: Backbone
        }
    };
});
