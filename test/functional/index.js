var jsdom = require('jsdom');
var symposia = require('../../')();

jsdom.env({
    html: '<div id="todoapp">hello world</div>',
    done: function (err, window) {
        console.log(window.document.getElementById('todoapp').innerHTML);
    }
});
