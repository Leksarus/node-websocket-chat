var socket = io();
socket.on('connect', function() {
	console.log('Connected to server');

	socket.emit('createMessage', {
		from: 'exampleMe',
		text: 'Lorem ipsum dolor sit amet'
	})
});

socket.on('disconnect', function() {
	console.log('Disconnected from server.');
})

socket.on('newMessage', function(message) {
	console.log('New message has been received from server', message );
});
