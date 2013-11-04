// -*- coding: utf-8-unix -*-

var io = require('socket.io').listen(8080, {'log level': 2});

var bearcount = 0;

var room = io.sockets.on('connection', function (socket) {
    socket.join('testroom');
    socket.on('bear.initialize', function (data) {
	console.log('bear.initialize { ' + 
		    'bearName: ' + data.bearName +
		    ', x: ' + data.x +
		    ', y: ' + data.y +
		    ' }');
    });
    socket.on('bear.onenterframe', function (data) {
	io.sockets.in('testroom').emit('bear.server', {
	    bearName: data.bearName,
	    x: data.x,
	    y: data.y,
	    tx: data.tx,
	    ty: data.ty
	});
    });
    socket.on('createGameScene', function (data) {
	console.log('createGameScene { bearcount: ' + bearcount + ' } ');
	var spriteframe = (bearcount % 2 == 0) ? 1 : 7;
	io.sockets.in('testroom').emit('addBear', {
	    x: 32 * spriteframe,
	    y: 32 * spriteframe,
	    spriteframe: spriteframe,
	    bearName: data.bearName
	});
	bearcount++;
    });

});
