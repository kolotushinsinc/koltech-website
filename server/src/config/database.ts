import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://root:Jdjdb2334328Hdbndhj@cluster0.y6mrt.mongodb.net/ktwebsite?retryWrites=true&w=majority&appName=Cluster0"';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;