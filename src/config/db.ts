import mongoose from 'mongoose';
import { MONGODB_URI } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};
