const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const generateMessage = require('../utils/message');
const { userJoin, getCurrentUser, userLeave ,getRoomUsers } = require('../utils/users');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketio(server);
app.use(express.static('public'))



app.get('/', (req, res) => {
    res.render('index.html')
})


io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);

    // Generate welcome message
    socket.emit('message', generateMessage('Admin', `${user.username}, welcome to the chat room!`))

    // Broadcast when a user connect
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} connected to the server.`))

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })

    // Forward create message event to client
    socket.on('chatMessage', (msg) => {
        io.to(user.room).emit('message', generateMessage(user.username, msg))
    })

     // Send 'user is typing' message to users
     socket.on('typing', (typingUser) => {
        socket.broadcast.to(user.room).emit('typing', typingUser)
        })
    })

   socket.on('disconnect', () => {
       const user = userLeave(socket.id);

       if(user) {
           io.to(user.room).emit(
               'message',
               generateMessage('Admin', `${user.username} has left the chat.`)
           )

            // Send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
       }
   })
   
})

server.listen(port, () => {
    console.log('Server up and running!');
})