var express = require('express');
var app     = express();
var server  = app.listen(3000);
var port    = process.env.port || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/'));
