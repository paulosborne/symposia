define(['symposia/base','symposia/sandbox'], function ( symposia, Sandbox ) {

    var Module = function ( config ) {
        this._id = _.uniqueId();
        this.id = config.id;
        this.creator = config.creator;
        this.subscriptions = [];
        this.options = config.options;
        this.init = config.options.init || true;

        if ( this.init ) {
            this.start();
        }
    };

    return Module;
});
