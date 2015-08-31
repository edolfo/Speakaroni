/* global $ */
/* global io */
'use strict';

var sock = io.connect('http://localhost:9000/speak');
var cmds = [];
var ptr = 0;

$('form').submit(function(){
    var val = $('#m').val();
    cmds.push(val);
    sock.emit('msg', val);
    $('#m').val('');
    ptr = 0;
    return false;
});

function shortCircuit(cmdCount, event){
    if (cmdCount === 0) {
        return true;
    }
    if ( [38, 40].indexOf(event.keyCode) === -1 ){
        return true;
    }
    return false;
}

// 38 -> up
// 40 -> down
$('#m').keyup(function(event) {
    var cmdCount = cmds.length;
    if (shortCircuit(cmdCount, event)){
        return;
    }
    var init = false;
    if (ptr === 0){
        init = true;
        ptr = cmdCount - 1;
    }
    if (event.keyCode === 38){
        if (ptr - 1 < 0){
            return;
        }
        if (!init){
            ptr -= 1;
        }
        $('#m').val(cmds[ptr]);
    } else if (event.keyCode === 40){
        if (ptr === cmdCount){
            $('m').val('');
            ptr = 0;
        } else {
            ptr += 1;
            $('#m').val(cmds[ptr]);
        }
    }
});

sock.on('init', function(msg){
    $('#messages').append($('<li>').text(msg));
});

sock.on('msg', function(msg){
    $('#messages').append($('<li>').text(msg));
});
