module.exports = function (symposia) {
    var _store      = [];
    var _sandbox    = symposia.sandbox.create();
    var api         = {};

    api.add = function (obj) {

        _store.push(obj);

        _sandbox.publish({
            channel: '_store',
            topic: 'item.added',
            data: [obj, _store]
        });

        return _store;
    };

    api.remove = function () {
        
    };

    api.list = function () {
        return _store;
    };

    api.find = function () {
        
    };

    symposia.store = api;
};
