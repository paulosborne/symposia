define(function (require) {

    var core        = require('src/core'),
        $           = require('jquery');

    core.sandbox = {
        /**
         * Create a new sandbox
         *
         * @param {object} core
         * @param {string} element - element to find
         * @return {object}
         */
        create: function (moduleName) {
            var _id      = _.uniqueId('sandbox-');
            var _name    = moduleName;
            var element  = $('#'+ _name);

            return {
                addWireTap: function ( callback ) {
                    core.events.addWireTap( callback );
                },
                /**
                 * Publish a message, attaches the sandbox id
                 *
                 * @param {object} envelope - message to be sent
                 */
                publish: function ( envelope ) {
                    envelope.data = envelope.data || {};
                    envelope.data.sender = _id;
                    core.events.publish( envelope );
                },
                /**
                 * Add a new message subscription
                 *
                 * @param {object} subDef - subscription definition
                 */
                subscribe: function ( subDef ) {
                    core.events.subscribe( subDef, _id );
                },
                /**
                 * Remove all sandbox subscriptions
                 */
                unsubscribeAll: function () {
                    core.events.unsubscribeAll( _id );
                },
                /**
                 * Unsubscribe a single subscription ( not implemented )
                 *
                 * @param {object} config
                 */
                unsubscribe: function ( config ) {
                    core.events.unsubscribe( config, _id );
                },
                /**
                 * Return all subscriptions for this sandbox
                 */
                getSubscriptions: function () {
                    return core.events.getSubscribers( _id );
                },
                /**
                 * Returns the DOM element associated with this sandbox
                 *
                 * @param {string} selector
                 */
                getElement: function (selector) {
                    return (selector) ? element.find(selector) : element;
                },
                /**
                 * Returns the ID of this sandbox
                 */
                getId: function () {
                    return _id;
                },
                /**
                 * Returns the name of the module associated with this sandbox.
                 *
                 * @return {string}
                 */
                getModuleName: function () {
                    return moduleName;
                }
            };
        }
    };

    return core.sandbox;

});
