const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
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

	/*socket.emit('newMessage', generateMessage('Admin', 'Welcome in channel'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));*/

	socket.on('join', (params, callback = () => {}) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			callback('Name and room name are required.')
		}

		socket.join(params.room);
		//socket.leave();

		// Way for sending messages for specific rooms
		// io.emit -> io.to('Room name').emit
		// socket.broadcast -> socket.broadcast.to('Room name').emit
		// socket.emit

		socket.emit('newMessage', generateMessage('Admin', 'Welcome in channel'));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	});

	socket.on('createMessage', (message, callback = () => {}) => {
		console.log(message, callback);
		console.log('dsad');

		// io emits event to everybody
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('Message has been send');
		// if I send event, broadcast will send message to everybody but me
		/*socket.broadcast.emit('newMessage', {
			from: message.from,
			text: message.text,
			createAt: new Date().getTime()
		})*/
	});

	socket.on('createLocationMessage', (coordinates, callback = () => {}) => {
		const { latitude, longitude } = coordinates;
		
		io.emit('newLocationMessage', generateLocationMessage('Admin', latitude, longitude));
		callback('Coordinates has been send');
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