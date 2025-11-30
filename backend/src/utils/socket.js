import jwt from 'jsonwebtoken';

let io = null;

// Initialize Socket.io
export const initializeSocket = (socketIO) => {
    io = socketIO;

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Authenticate socket connection
        const token = socket.handshake.auth.token;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                socket.userId = decoded._id;

                // Join user's personal room for targeted notifications
                socket.join(`user:${decoded._id}`);
                console.log(`User ${decoded._id} joined their room`);
            } catch (error) {
                console.error('Socket authentication failed:', error.message);
                socket.disconnect();
                return;
            }
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return io;
};

// Get Socket.io instance
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Emit notification to specific user
export const emitNotificationToUser = (userId, notification) => {
    try {
        const socketIO = getIO();
        socketIO.to(`user:${userId}`).emit('notification', notification);
        console.log(`Notification sent to user ${userId}`);
    } catch (error) {
        console.error('Error emitting notification:', error.message);
    }
};

// Emit notification to multiple users
export const emitNotificationToUsers = (userIds, notification) => {
    try {
        const socketIO = getIO();
        userIds.forEach(userId => {
            socketIO.to(`user:${userId}`).emit('notification', notification);
        });
        console.log(`Notification sent to ${userIds.length} users`);
    } catch (error) {
        console.error('Error emitting notifications:', error.message);
    }
};

// Broadcast to all connected clients
export const broadcastNotification = (notification) => {
    try {
        const socketIO = getIO();
        socketIO.emit('notification', notification);
        console.log('Notification broadcasted to all users');
    } catch (error) {
        console.error('Error broadcasting notification:', error.message);
    }
};
