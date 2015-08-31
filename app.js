'use strict';
var express = require('express');
var app = express();
var io = require('socket.io')(9000);
var config = require('./config');
app.set('config', config);
app.set('cwd', process.cwd());
require('./sockets/speak')(app, io);

app.use('/public', express.static(process.cwd() + config.static));
app.use('/node_modules', express.static(process.cwd() + config.nodeModules));

var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});
