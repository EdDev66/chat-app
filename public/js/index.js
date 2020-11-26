var socket = io();

const loginBtn = document.querySelector('#loginBtn');

loginBtn.addEventListener('click', () => {
    const username = document.querySelector('#nameField').value;
    const room = document.querySelector('#roomFields').value;

    socket.emit('login user', {
        username,
        room
    })
})