// -*- coding: utf-8-unix -*-

var io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
    socket.on('bear', function (data) {
	console.log(data);
    });
});

