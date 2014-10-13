function symposiaRemote (sym) {
    var ws;
    var connected   = false;
    var remote      = {};
    var errors      = [];
    var queue       = [];

    if (!sym.config.ws && sym.config.ws !== typeof Socket) {
        return;
    }

    ws = sym.config.ws;

    ws.on('connect', function (data) {
        connected = true;
        console.log('tweet', data);
    });

    ws.on('disconnect', function () {
        connected = false;
    });

    ws.on('error', function (data) {
        errors.push(data);
    });

    remote.send =  function (ev, data) {
        if (connected) {
            ws.emit(ev, data);
        } else {
            this.queue(ev, data);
        }
    };

    remote.log = function (ev, data) {
        if (connected) {
            ws.emit(ev, {
                timeStamp: new Date(),
                data: data
            });
        } else {
            this.queue(ev, data);
        }
    };

    remote.queue = function (ev, data) {
        queue.push({ ev: ev, data: data });
    };

    sym.remote = remote;
}

module.exports = symposiaRemote;
