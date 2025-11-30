// required('dotenv').config({path: './env'})

import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initializeSocket } from "./utils/socket.js";


dotenv.config({
    path: './env'
})

const port = process.env.PORT || 8000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true
    }
});

// Initialize socket handlers
initializeSocket(io);

// Make io accessible to routes
app.set('io', io);

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error: ", error);
            throw error
        })
        httpServer.listen(port, "0.0.0.0", () => {
            console.log(`Server is running at port: ${port}`);
            console.log(`Socket.io is ready for connections`);
        })
    })
    .catch((error) => {
        console.log("MONGO DB connection failed !!!! ", error);

    })
