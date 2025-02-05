import mongoose from 'mongoose';
export const connectDB = async () => {
    let mongodbUrl = process.env.DBURL;
    try {
        const conn =  await mongoose.connect(mongodbUrl)
        console.log(`MongoDB Connected on: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
     
        
    }
}