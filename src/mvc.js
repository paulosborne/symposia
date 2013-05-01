define(['./seed','backbone'], function ( symposia, Backbone ) {

    symposia.mvc = {
        View: function ( config ) {
            return Backbone.View.extend( config );
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
    };

    return symposia;
});
