var socket = io();

const chatBox = document.querySelector('#messageBox');
const chatButton = document.querySelector('#sendBtn');
const input = document.querySelector('#chatInput');
const feedback = document.querySelector('#feedback')
const chatWindow = document.querySelector('.msgContainer');

const roomName = document.querySelector('#room-name');
const usersList = document.querySelector('#usersBox')

// Get username and room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chat room
socket.emit('joinRoom', {
    username,
    room
})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


// Get input value and send it to server, emit next event

    chatButton.addEventListener('click', (e) => {
        e.preventDefault();
        const message = document.querySelector('#chatInput').value;
        socket.emit('chatMessage', message);

            // Clear input & focus on input
            document.querySelector('#chatInput').value = '';
            document.querySelector('#chatInput').focus();
    })


// Emit message when user is typing
    input.addEventListener('keypress', () => {
        socket.emit('typing', username)
    })

// Handle server response from type emit
    socket.on('typing', (user) => {
        feedback.innerHTML = `${user} is typing...`
    })

// Message from server
socket.on('message', (msg) => {
    outputMessage(msg);

     // Scroll down
     chatWindow.scrollTop = chatWindow.scrollHeight
})


// Output message to DOM
function outputMessage(message) {
    feedback.innerHTML = '';
    let div = document.createElement('div');
    div.classList.add('chatMessage')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`

    chatBox.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}