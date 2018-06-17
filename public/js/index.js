var socket = io();

function scrollToBottom() {
	var messagesContainer = document.querySelector('#messages');
	var newMessageHeight = messagesContainer.querySelector('li:last-child').offsetHeight;
	var lastMessage = messagesContainer.querySelector('li:last-child').previousElementSibling;
	var height = messagesContainer.clientHeight;
	var scrollHeight = messagesContainer.scrollHeight;
	var lastMessageHeight = lastMessage ? lastMessage.offsetHeight : 0;
	
	if ((height + messagesContainer.scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
		messagesContainer.scrollTop = scrollHeight - height;
	}
}

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
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	var template = document.querySelector('#locationMessageTemplate').innerHTML;
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var html = Mustache.render(template, {
		text: message.text,
		createdAt: formattedTime,
		from: message.from
	});
	console.log(template, html, typeof template, typeof html);
	document.querySelector('#messages').innerHTML += html;
	scrollToBottom();
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
	var template = document.querySelector('#messageTemplate').innerHTML;
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var html = Mustache.render(template, {
		text: message.text,
		createdAt: formattedTime,
		from: message.from
	});
	console.log(template, html, typeof template, typeof html);
	document.querySelector('#messages').innerHTML += html;
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