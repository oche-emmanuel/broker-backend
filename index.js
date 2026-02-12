require('dotenv').config();

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
    }
});

connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Socket.io for Chat
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their chat room`);
    });

    socket.on('sendMessage', async ({ userId, text, sender }) => {
        console.log(`Received message from ${sender} for user ${userId}: ${text}`);
        try {
            const message = await Message.create({ userId, text, sender });
            console.log('Message saved to DB:', message._id);
            // Emit to the specific user's room (both user and admin listen here)
            io.to(userId.toString()).emit('message', message);
        } catch (err) {
            console.error('Socket message error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
