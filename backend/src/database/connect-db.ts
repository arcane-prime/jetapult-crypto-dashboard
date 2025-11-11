import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() { 
    try { 
        const mongoUri = process.env.MONGO_URI || '';

        console.log('uri', mongoUri);
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}