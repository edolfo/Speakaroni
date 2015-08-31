'use strict';

module.exports = function(app, io){
    app.get('/', function(req, res) {
        res.sendFile(app.get('cwd') + '/public/index.html');
    });

    var speak = io.of('/speak');
    var spawn = require('child_process').spawn;

    speak.on('connection', function(sock) {
        var initMsg = ['Welcome to Speakaroni! (pls no copy pasterino)'];
        initMsg.push('Type in a phrase to have it read out loud.');
        initMsg.push('Press up or down on the keyboard to cycle through your history.');
        initMsg.push('Have fun!');
        initMsg.forEach(function(m){
            sock.emit('init', m);
        });
        sock.on('msg', function(msg) {
            var result;
            var cmd = spawn('say', [msg]);
            cmd.stdout.on('data', function(data){
                result = data;
            });

            cmd.stderr.on('data', function(data){
                console.error(data);
                result = 'Error: ' + data;
            });

            cmd.on('close', function(){
                if (!result){
                    result = msg;
                }
                sock.emit('msg', result);
            });
        });
    });
};
