import mongoose from 'mongoose';

export const connectDB = async () => {
    let mongodbUrl = 'mongodb://localhost:27017/mern';
    try {
        const conn =  await mongoose.connect(mongodbUrl)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
     
        
    }
}