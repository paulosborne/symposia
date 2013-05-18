define(function() {

    var Subscription = function ( config ) {

        if ( !_.isObject( config.subscription )) {
            throw new TypeError('Invalid subscription type');
        }

        if( !_.isString( config.signature ) ) {
            throw new TypeError('Invalid signature type');
        }

        // give subscriber uniqueId
        this._id = _.uniqueId('subscriber-');

        //  object that sent the subscription request
        this.signature = config.signature;

        // SubscriptionDefinition
        this.instance = config.subscription
    }

    return Subscription;

});
