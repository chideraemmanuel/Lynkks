import mongoose from 'mongoose';

export const connectToDatabase = () =>
  mongoose.connect(process.env.DATABASE_URI!);
