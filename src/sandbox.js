define(function (require) {

    var core        = require('src/core'),
        $           = require('jquery');

    core.sandbox = {
        /**
         * Create a new sandbox
         *
         * @param {string} moduleName
         * @return {object}
         */
        create: function (moduleName) {
            var _id             = _.uniqueId('sandbox-'),
                _name           = moduleName,
                _$el            = $('#'+ _name),
                _subscriptions  = [];

            return {
                /**
                 * Provides a convenient way to query module dom element.
                 *
                 * @param {string}
                 * @return {object}
                 */
                $: function (selector) {
                    return (selector) ? _$el.find(selector) : _$el;
                },
                /**
                 * Publish a message, attaches the sandbox id
                 *
                 * @param {object} envelope - message to be sent
                 */
                publish: function (envelope) {
                    core.bus.publish(envelope);
                },
                /**
                 * Add a new message subscription
                 *
                 * @param {object} def - subscription definition
                 */
                subscribe: function (def) {
                    var sub;

                    try {
                        if (!_.has(def, 'topic') && !_.has(def, 'callback')) {
                            throw new Error('Missing topic or callback for '+ _name);
                        }

                        sub = core.bus.subscribe(def);

                        _subscriptions.push(sub);

                        return sub;

                    } catch (e) {
                        core.log('info', e.message);
                    }
                },
                /**
                 * Remove all sandbox subscriptions
                 */
                unsubscribeAll: function () {
                    var i = 0;

                    while(_subscriptions.length) {
                        _subscriptions.shift().unsubscribe();
                        i++;
                    }

                    return i;
                },
                /**
                 * Unsubscribe a single subscription ( not implemented )
                 *
                 * @param {string} topic -  subscription to remove
                 */
                unsubscribe: function (topic) {
                    var topics  = _.pluck(_subscriptions, 'topic'),
                        idx     = topics.indexOf(topic);

                    if (idx !== -1) {
                        _(_subscriptions.splice(idx, 1)).invoke('unsubscribe');
                    }

                    return _subscriptions;
                },
                /**
                 * Return all subscriptions for this sandbox
                 */
                getSubscriptions: function () {
                    return _subscriptions;
                },
                /**
                 * Returns the DOM element associated with this sandbox
                 *
                 * @param {string} selector
                 */
                getElement: function (selector) {
                    return this.$(selector);
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
                    return _name;
                }
            };
        }
    };

    return core.sandbox;

});
