define(function () {

    var Module = function ( core, config ) {
        this._id = _.uniqueId('module-');
        this.name  = config.name;
        this.creator = config.creator;
        this.options = config.options;
        this.init = config.init || true;
    };

    Module.prototype = {
        // extend module object here
    };

    return Module;

});
