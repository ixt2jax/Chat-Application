const express=require('express');
const {Server}=require('socket.io');
const http=require('http');


const router=require("./router")
const cors = require('cors');

const app=express();
app.use(cors());

const {addUser, removeUser , getUser , getUserInRoom }=require('./users');
const { measureMemory } = require('vm');

const PORT=process.env.PORT || 3000;

const server= http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your React app's URL (Vite default port)
      methods: ["GET", "POST"],
      credentials: true,
    }
  });


io.on('connection', (socket) => {
    console.log('New user connected with ID:', socket.id);
    socket.on('join', (data, callback) => {
        const { name, room } = data || {};
        // if (typeof callback === 'function') {
        //     return callback(error);
        // }
        // callback()
        // console.log({ name, room });

        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) {  //if the user already exists
            console.log('Error adding user:', error);
            return callback(error);
        }

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${room}.` });
        
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined`});

        socket.join(user.room);  //built-in socket method to join the room

        console.log(`New user added: ${user.name} in room: ${user.room}`);
        
        callback();
    });

    socket.on('sendMessage', (message,callback)=>{
        const user=getUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: user.name, text: message });
        } else {
            console.log('User not found for socket ID:', socket.id);
            return callback('User not found');
        }

        callback();
    })
    socket.on('disconnect',()=>{
        console.log('User has left!!!');
    });
  });



server.listen(PORT, ()=>{
    console.log(`Server is started on port: ${PORT}`);
})


// const express = require('express');
// const socketio = require('socket.io');
// const http = require('http');
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
// const PORT = process.env.PORT || 5173;

// const router = require('./router');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(router);

// const server = http.createServer(app);
// const io = socketio(server, {
//     cors: {
//         origin: "http://localhost:5173", // Your frontend URL
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// io.on('connection', (socket) => {
//     console.log('New user connected with ID:', socket.id);

//     // Handle 'join' event
//     socket.on('join', ({ name, room }, callback) => {
//         console.log('JOIN EVENT TRIGGERED:', { name, room });

//         const { error, user } = addUser({ id: socket.id, name, room });

//         if (error) {
//             console.log('Error adding user:', error);
//             return callback(error);
//         }

//         socket.join(user.room);
//         console.log(`New user added: ${user.name} in room: ${user.room}`);

//         // Welcome message to the user who joined
//         socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${room}.` });

//         // Broadcast to others in the room that a new user has joined
//         socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the room.` });

//         // Callback to acknowledge success
//         callback();
//     });

//     // Handle 'sendMessage' event
//     socket.on('sendMessage', (message, callback) => {
//         const user = getUser(socket.id);

//         if (!user) {
//             console.log('User not found for socket ID:', socket.id);
//             return callback('User not found');
//         }

//         console.log('Message received from:', user.name, 'in room:', user.room, 'Message:', message);

//         // Broadcast the message to everyone in the room
//         io.to(user.room).emit('message', { user: user.name, text: message });

//         // Callback to acknowledge message delivery
//         callback();
//     });

//     // Handle 'disconnect' event
//     socket.on('disconnect', () => {
//         console.log('User disconnected with ID:', socket.id);

//         const user = removeUser(socket.id);

//         if (user) {
//             console.log('User removed:', user.name);
//             io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left the room.` });
//         }
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on port: ${PORT}`);
// });