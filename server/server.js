const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
// Heroku sets process.env.PORT variable
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Serves static assets
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome in channel'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (message) => {
		console.log(message);

		// io emits event to everybody
		io.emit('newMessage', generateMessage(message.from, message.text));

		// if I send event, broadcast will send message to everybody but me
		/*socket.broadcast.emit('newMessage', {
			from: message.from,
			text: message.text,
			createAt: new Date().getTime()
		})*/
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

server.listen(port, () => {
	console.log(`Started on port ${port}`);
})

// socket.emit emits event to single connection
// io.emit emits event to every connection
// socket.broadcast send event to everybody but source event maker