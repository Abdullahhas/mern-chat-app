import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import {app , server} from "./lib/socket.js"


dotenv.config({path: '../.env'});
const PORT = process.env.PORT || 3000;
console.log(PORT)



connectDB();


app.use(cors({
    origin: 'http://localhost:5173', // Corrected the trailing slash
    credentials: true, // Enable credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Allowed headers
}));

app.use(express.json({ limit: '10mb' })); // Adjust limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser()); // Parse cookies

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
