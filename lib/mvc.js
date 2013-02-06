define(["backbone"], function ( Backbone ) {

    var mvc = {};

    mvc.View = function ( view ) {
        return Backbone.View.extend( view );
    };

    mvc.Model = function ( model ) {
        return Backbone.Model.extend( model );
    };

    mvc.Collection = function ( collection ) {
        return Backbone.Collection.extend( collection );
    };

    mvc.Router = function ( router ) {
        return Backbone.Router.extend( router );
    };

    return mvc;
});
