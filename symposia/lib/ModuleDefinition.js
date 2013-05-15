define(function () {

    var ModuleDefinition = function ( config ) {
        this.id = config.id;
        this.creator = config.creator;
        this.subscriptions = [];
    };

    ModuleDefinition.prototype = {
    };

    return ModuleDefinition;

});
