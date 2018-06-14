var socket = io();
socket.on('connect', function() {
	console.log('Connected to server');
/*
	socket.emit('createMessage', {
		from: 'exampleMe',
		text: 'Lorem ipsum dolor sit amet'
	});*/
});

socket.on('disconnect', function() {
	console.log('Disconnected from server.');
})

socket.on('newMessage', function(message) {
	console.log('New message has been received from server', message );

	displayNewMessage(message);
});

socket.on('newLocationMessage', function(message) {
	var list = document.querySelector('#messages');
	var li = document.createElement('a');
	var link = document.createElement('a');
	li.innerHTML = `${message.from} location: `
	link.setAttribute('target', '_blank');
	link.href = message.url;
	link.innerHTML = message.url;
	li.appendChild(link);
	list.appendChild(li);
})

/*socket.emit('createMessage', {
	from: 'Frank',
	text: 'Trolo'
}, function(serverMessage){
	console.log(serverMessage);
});*/

document.querySelector('#message-form').addEventListener('submit', function(e) {
	var message = document.querySelector('.messageInput');
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: message.value
	}, function(serverMessage) {
		message.value = '';
	})	
})

function displayNewMessage(message) {
	var list = document.querySelector('#messages');
	var newMessage = document.createElement('li');
	newMessage.innerHTML = `${message.from}: ${message.text}`;
	list.appendChild(newMessage);
}

document.querySelector('#sendLocation').addEventListener('click', function(event) {
	var locationButton = document.querySelector('#sendLocation');
	if (!navigator.geolocation) {
		return alert('Gelocation not available');
	}

	locationButton.setAttribute('disabled', 'disabled');
	locationButton.innerHTML = 'Loading';

	navigator.geolocation.getCurrentPosition(function(position) {
		locationButton.removeAttribute('disabled');
		locationButton.innerHTML = 'Send location';
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		}, function(serverMessage) {
			console.log(serverMessage);
		})		
	}, function() {
		locationButton.removeAttribute('disabled');
		locationButton.innerHTML = 'Send location';
		alert('Unable to fetch location');
	})
})