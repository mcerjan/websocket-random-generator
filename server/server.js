var usernames = {};
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


http.listen(process.env.PORT || 3000);
console.log("Server online, port 3000");

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var chat = io
	.on('connection', function (socket) {
		socket.on('chat', function(msg){
			chat.emit('chat', msg);
			console.log('Generirana nova poruka od korisnika: '+ msg.NICK +' : '+ msg.MESSAGE);
    		});
  	});
	
var server = io
	.on('connection', function (socket) {
		var address = socket.handshake.address;
		socket.on('joinnick', function(msg){
			usernames[msg] = msg;
			socket.username = msg;
			server.emit('server', "Welcome user " + msg + " :)");
			console.log('Nick join: ' + address +' - '+ socket.id +' - '+ msg);
		});
	});

io.on('connection', function(socket){
	var address = socket.handshake.address;
	console.log('Connected: ', address, socket.id);
	socket.on('disconnect', function(){
		delete usernames[socket.username];
		console.log('Disconnected: ', address, socket.id);
	});
});