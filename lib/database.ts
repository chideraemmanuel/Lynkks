import mongoose from 'mongoose';

export const connectToDatabase = () => {
  if (mongoose.connection.readyState === 0) {
    return mongoose.connect(process.env.DATABASE_URI!);
  }
};
