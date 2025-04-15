// This is the Node server which will handle Socket.IO connections

const { Server } = require('socket.io');

// Create a new Socket.IO server on port 3000 with CORS configuration
const io = new Server(3000, {
    cors: {
        origin: "http://127.0.0.1:5500",  // Allow specific origin (adjust if needed)
        methods: ["GET", "POST"]
    }
});

const users = {};

// io.on ek socket.io instance hai jo bohot sare socket connections ko listen karega
// Particular connection ke sath kya hona chahiye vo socket.on dekhega socket.on receive/listen
io.on('connection', socket => {
    console.log('A user connected');

    // Jab new user join karega to yeh event trigger hoga
    socket.on('new-user-joined', name => {
        console.log("New user:", name);  // New user ka naam console mein show karega
        users[socket.id] = name;  // Fixed typo: users object mein socket.id se naam store karega
        socket.broadcast.emit('user-joined', name);  // Dusre users ko batayega ki naya user join hua hai
    });

    // Jab koi message bheja jata hai to yeh event trigger hoga
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Jab user disconnect karega to yeh event trigger hoga
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);  // Dusre users ko batayega ki user chat se chala gaya
            delete users[socket.id];  // users object se user ko delete kar dega
        }
    });
});

console.log('Server is running on port 3000');
