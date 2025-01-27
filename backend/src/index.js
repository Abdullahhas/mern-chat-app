import express from 'express';
const app = express();

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';


import cookieParser from 'cookie-parser';
import cors from 'cors';
import {connectDB} from './lib/db.js';

import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;
 
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth' , authRoutes)
app.use('/api/message' , messageRoutes)


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));



app.listen(PORT, () => {
    console.log('Server is running on port 3000');
    connectDB();
    });
