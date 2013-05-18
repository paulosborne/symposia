define(function() {

    var Subscription = function ( subscription, signature ) {

        try {
            if ( _.isObject( subscription ) && _.isString( signature ) {

            } else {
                throw new TypeError;
            }
        } catch ( ex ) {
            if ( ex instanceof TypeError ) {
                throw TypeError('arguments
        }
        this._id = _.uniqueId('subscriber-');

        if ( _.isObject( config.subscription ) {
            this.instance = config.subscription;
        } else {
            throw new TypeError("'subscription' required and must be an object");
        }

        if( _.isString( config.signature ) ) {
            this.signature = signature;
        } else {
            throw new TypeError("'signature' required and must be a string");
        }
    }

    return Subscription;

});
