define(['symposia/core','symposia/sandbox'], function ( symposia, Sandbox ) {

    var SymModule = function ( config ) {
        this._id = Math.uuid();
        this.id = config.id;
        this.creator = config.creator;
        this.subscriptions = [];
        this.initialize = true;
    };

    SymModule.prototype = {
        start: function () {
            this.instance = this.creator( new Sandbox( symposia, this.id ));
            this.instance.init();
        },
        stop: function () {
        }
    };

    return SymModule;
});
